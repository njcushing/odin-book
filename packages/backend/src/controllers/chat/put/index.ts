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
