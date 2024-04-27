import { Request, Response } from "express";
import * as types from "@/utils/types";
import generateToken from "@/utils/generateToken";
import sendResponse from "@/utils/sendResponse";
import protectedRouteJWT from "@/utils/protectedRouteJWT";
import User from "@/models/user";
import Chat from "@/models/chat";
import checkRequestValidationError from "@/utils/checkRequestValidationError";
import mongoose from "mongoose";
import checkUserAuthorisedInChat from "../utils/checkUserAuthorisedInChat";
import validators from "../validators";

export const name = [
    protectedRouteJWT,
    validators.param.chatId,
    validators.body.name,
    checkRequestValidationError,
    async (req: Request, res: Response) => {
        const { chatId } = req.params;
        const newName = req.body.name;

        const chat = await Chat.findOne({
            _id: chatId,
            participants: {
                $elemMatch: { user: res.locals.user.id },
            },
        });
        if (!chat) {
            return sendResponse(
                res,
                404,
                "Either chat could not be found in the database or user is not a participant in the specified chat",
            );
        }

        // validate active user is allowed to change the chat's name
        const [userAuthorised, authMessage] = checkUserAuthorisedInChat(
            res.locals.user.id,
            chat.participants,
            true,
            "guest",
        );
        if (!userAuthorised) return sendResponse(res, 401, authMessage);

        const updatedChat = await Chat.findByIdAndUpdate(chatId, { $set: { name: newName } });
        if (updatedChat === null) {
            return sendResponse(res, 404, "Specified chat not found in the database");
        }

        const response = await generateToken(res.locals.user)
            .then((token) => {
                return sendResponse(res, 200, "Chat name updated successfully", { token });
            })
            .catch((tokenErr) => {
                return sendResponse(
                    res,
                    500,
                    tokenErr.message || "Chat name updated successfully, but token creation failed",
                    null,
                    tokenErr,
                );
            });

        return response;
    },
];

export const participants = [
    protectedRouteJWT,
    validators.param.chatId,
    validators.body.participants,
    checkRequestValidationError,
    async (req: Request, res: Response) => {
        const { chatId } = req.params;
        const newParticipants = req.body.participants;

        // validate all users specified
        let invalidParticipant = false;
        const participantValidationResult = await Promise.all(
            newParticipants.map(async (participant: string) => {
                const user = await User.findById(participant).exec();
                if (!user) {
                    throw new Error(`User not found in database: ${participant}`);
                }
                return user;
            }),
        ).catch((err) => {
            invalidParticipant = true;
            return sendResponse(res, 404, err.message, null, err);
        });
        if (invalidParticipant) return participantValidationResult;

        // match chat to ensure active user is a participant in the specified chat
        // also prevent a match if any participants are present in the 'participants' array
        const chat = await Chat.findOne({
            _id: chatId,
            participants: {
                $elemMatch: { user: res.locals.user.id },
                $not: { $elemMatch: { user: { $in: newParticipants } } },
            },
        });
        if (!chat) {
            return sendResponse(
                res,
                404,
                `Either chat could not be found in the database, user is not a participant in the
                 specified chat, or user is attempting to add participants to the chat that are
                 already in the chat`,
            );
        }

        // validate active user is allowed to add new participants to the chat
        const [userAuthorised, authMessage] = checkUserAuthorisedInChat(
            res.locals.user.id,
            chat.participants,
            true,
            "guest",
        );
        if (!userAuthorised) return sendResponse(res, 401, authMessage);

        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            // add participants to chat's 'participants' array field
            const updatedChat = await Chat.updateOne(
                { _id: chat._id },
                {
                    $addToSet: {
                        participants: {
                            $each: newParticipants.map((participant: string) => ({
                                user: participant,
                            })),
                        },
                    },
                },
            );
            if (!updatedChat.acknowledged) {
                const error = new Error(
                    `Could not add message to chat's messages.`,
                ) as types.ResponseError;
                error.status = 500;
                throw error;
            }

            // add chat _id to 'chats' array for all new participants
            await Promise.all(
                newParticipants.map(async (participant: string) => {
                    const updatedUser = await User.findByIdAndUpdate(participant, {
                        $addToSet: { chats: chat._id },
                    });
                    if (updatedUser === null) {
                        const error = new Error(
                            `User not found in database: ${participant}.`,
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
            const response = await generateToken(res.locals.user)
                .then((token) => {
                    return sendResponse(res, 200, "Participants successfully added to chat", {
                        token,
                    });
                })
                .catch((tokenErr) => {
                    return sendResponse(
                        res,
                        500,
                        tokenErr.message ||
                            "Participants successfully added to chat, but token creation failed",
                        null,
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