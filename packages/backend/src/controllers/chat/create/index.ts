import { Request, Response } from "express";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import generateToken from "@/utils/generateToken";
import sendResponse from "@/utils/sendResponse";
import protectedRouteJWT from "@/utils/protectedRouteJWT";
import forbidGuest from "@/utils/forbidGuest";
import { multiple } from "@/utils/uploadImage";
import User from "@/models/user";
import Chat from "@/models/chat";
import Message from "@/models/message";
import Image from "@/models/image";
import * as types from "@/utils/types";
import { body } from "express-validator";
import checkRequestValidationError from "@/utils/checkRequestValidationError";
import checkUserAuthorisedInChat from "../utils/checkUserAuthorisedInChat";
import validators from "../validators";

export const regular = [
    protectedRouteJWT,
    forbidGuest,
    validators.body.participants,
    checkRequestValidationError,
    asyncHandler(async (req: Request, res: Response) => {
        const { participants } = req.body;

        // validate all users specified
        let invalidParticipant = false;
        await Promise.all(
            participants.map(async (participant: string) => {
                const user = await User.findById(participant).exec();
                if (!user) {
                    throw new Error(`User not found in database: ${participant}`);
                }
                return user;
            }),
        ).catch((err) => {
            invalidParticipant = true;
            sendResponse(res, 404, err.message, null, err);
        });
        if (invalidParticipant) return;

        // for a single user, attempt to create an 'individual'-type chat
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            participants.push(res.locals.user.id);

            const chatType = participants.length === 2 ? "individual" : "group";

            // for a single additional participant, check if chat already exists
            if (chatType === "individual") {
                const existingChat = await Chat.findOne({
                    type: "individual",
                    participants: { $size: 2 },
                    "participants.user": {
                        $all: participants.map(
                            (participant: string) => new mongoose.Types.ObjectId(participant),
                        ),
                    },
                });
                if (existingChat) {
                    session.endSession();
                    sendResponse(res, 409, `Chat already exists`, { chatId: existingChat._id });
                    return;
                }
            }

            /*
             * assign roles to participants
             * - in 'individual'-type chats, all users get the 'admin' role
             * - in 'group'-type chats, the creator gets the 'admin' role and others get the
             *   'guest' role
             */
            const participantObjects = participants.map((participant: string) => ({
                user: participant,
                role: (() => {
                    if (participant === res.locals.user.id) {
                        return "admin";
                    }
                    if (chatType === "individual") {
                        return "admin";
                    }
                    return "guest";
                })(),
            }));

            // create chat
            const chat = new Chat({
                type: chatType,
                createdBy: res.locals.user.id,
                participants: participantObjects,
            });
            await chat.save({ session }).catch((saveErr) => {
                const error = new Error(saveErr);
                throw error;
            });

            // add new chat _id to 'chats' array for all users
            await Promise.all(
                chat.participants.map(async (participant) => {
                    const updatedUser = await User.findByIdAndUpdate(participant.user, {
                        $addToSet: { chats: chat._id },
                    });
                    if (updatedUser === null) {
                        const error = new Error(
                            `User not found in database: ${participant.user}.`,
                        ) as types.ResponseError;
                        error.status = 404;
                        throw error;
                    }
                    return updatedUser;
                }),
            );

            await session.commitTransaction();

            session.endSession();

            // create token and send response
            await generateToken(res.locals.user)
                .then((token) => {
                    sendResponse(res, 201, "Chat created successfully", {
                        token,
                        chatId: chat._id,
                    });
                })
                .catch((tokenErr) => {
                    sendResponse(
                        res,
                        500,
                        tokenErr.message || `Chat created successfully, but token creation failed`,
                        { chatId: chat._id },
                        tokenErr,
                    );
                });
        } catch (err: unknown) {
            await session.abortTransaction();

            session.endSession();

            const status =
                err && typeof err === "object" && "status" in err ? (err.status as number) : 500;
            const message =
                err && typeof err === "object" && "message" in err
                    ? (err.message as string)
                    : "Internal Server Error";
            const error = err instanceof Error ? (err as types.ResponseError) : null;
            sendResponse(res, status, message, null, error);
        }

        // delete all created documents in case of aborted transaction
        session.on("abort", async () => {
            try {
                await Chat.deleteMany({ session });
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error("Error occurred while deleting documents:", error);
            }
        });
    }),
];

export const message = [
    protectedRouteJWT,
    forbidGuest,
    validators.param.chatId,
    validators.body.text,
    validators.body.images,
    validators.body.replyingTo,
    body("text").custom((value, { req }) => {
        if (req.body.text.length === 0 && req.body.images.length === 0) {
            throw new Error(
                "Your message must not be empty; there must either be some text, or images.",
            );
        } else {
            return true;
        }
    }),
    checkRequestValidationError,
    async (req: Request, res: Response) => {
        const { chatId } = req.params;

        // find user & chat
        const user = await User.findById(res.locals.user._id);
        const chat = await Chat.findById(chatId);
        if (!user) return sendResponse(res, 404, "User not found in database");
        if (!chat) return sendResponse(res, 404, "Chat not found in database");

        // validate user is allowed to post in chat
        const [userAuthorised, authMessage] = checkUserAuthorisedInChat(
            user._id,
            chat.participants,
            true,
            "guest",
        );
        if (!userAuthorised) return sendResponse(res, 403, authMessage);

        // attempt to upload all images
        const [uploadResult, uploadResponses] = await multiple(req.body.images);
        if (!uploadResult) return sendResponse(res, 500, "Could not upload images");

        const session = await mongoose.startSession();

        // delete all created documents in case of aborted transaction
        session.on("abort", async () => {
            try {
                await Message.deleteMany({ session });
                await Image.deleteMany({ session });
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error("Error occurred while deleting documents:", error);
            }
        });

        try {
            session.startTransaction();

            // create images

            /*
             * I need to disable the linter rule here because I *do* need to perform each database
             * operation consecutively rather than concurrently. There is a problem with using
             * sessions in the .save method's options parameter if the documents are being saved
             * concurrently, which sometimes causes the transaction to fail.
             */

            const images = [];
            for (let i = 0; i < uploadResponses.length; i++) {
                const url = uploadResponses[i];
                /* eslint-disable-next-line no-await-in-loop */
                const image = await new Image({ url })
                    .save({ session })
                    .then(async (result) => result)
                    .catch((saveErr) => {
                        throw saveErr;
                    });
                images.push(image);
            }

            // create message
            const newMessage = new Message({
                author: user._id,
                text: req.body.text,
                images: images.map((image) => image._id),
                replyingTo: req.body.replyingTo ? req.body.replyingTo : null,
            });
            await newMessage.save({ session }).catch((saveErr) => {
                const error = new Error(saveErr);
                throw error;
            });

            // add new message _id to chat's 'messages' array field
            const updatedChat = await Chat.updateOne(
                { _id: chat._id },
                { $addToSet: { messages: newMessage._id } },
            );
            if (!updatedChat.acknowledged) {
                const error = new Error(
                    `Could not add message to chat's messages.`,
                ) as types.ResponseError;
                error.status = 500;
                throw error;
            }

            // format new message similarly to /chat/:chatId/messages GET route
            const newMessageFormatted = {
                _id: newMessage._id,
                author: newMessage.author,
                imageCount: !newMessage.deleted ? newMessage.images.length : 0,
                replyingTo: !newMessage.deleted ? newMessage.replyingTo : null,
                deleted: newMessage.deleted,
                createdAt: newMessage.createdAt,
            };

            await session.commitTransaction();

            session.endSession();

            // create token and send response
            const response = await generateToken(res.locals.user)
                .then((token) => {
                    return sendResponse(res, 201, "Message created successfully", {
                        token,
                        message: newMessageFormatted,
                    });
                })
                .catch((tokenErr) => {
                    return sendResponse(
                        res,
                        500,
                        tokenErr.message ||
                            `Message created successfully, but token creation failed`,
                        { message: newMessageFormatted },
                        tokenErr,
                    );
                });
            return response;
        } catch (err: unknown) {
            await session.abortTransaction();

            session.endSession();

            const status =
                err && typeof err === "object" && "status" in err ? (err.status as number) : 500;
            const errMessage =
                err && typeof err === "object" && "message" in err
                    ? (err.message as string)
                    : "Internal Server Error";
            const error = err instanceof Error ? (err as types.ResponseError) : null;
            return sendResponse(res, status, errMessage, null, error);
        }
    },
];
