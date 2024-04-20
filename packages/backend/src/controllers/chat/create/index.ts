import { Request, Response } from "express";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import generateToken from "@/utils/generateToken";
import sendResponse from "@/utils/sendResponse";
import protectedRouteJWT from "@/utils/protectedRouteJWT";
import User from "@/models/user";
import Chat from "@/models/chat";
import * as types from "@/utils/types";
import checkRequestValidationError from "@/utils/checkRequestValidationError";
import validators from "../validators";

export const regular = [
    protectedRouteJWT,
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
                        chatId: chat,
                    });
                })
                .catch((tokenErr) => {
                    sendResponse(
                        res,
                        500,
                        tokenErr.message || `Chat created successfully, but token creation failed`,
                        { chatId: chat },
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
                console.error("Error occurred while deleting documents:", error);
            }
        });
    }),
];
