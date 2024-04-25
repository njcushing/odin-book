import { Request, Response } from "express";
import generateToken from "@/utils/generateToken";
import sendResponse from "@/utils/sendResponse";
import protectedRouteJWT from "@/utils/protectedRouteJWT";
import Chat from "@/models/chat";
import Message from "@/models/message";
import checkRequestValidationError from "@/utils/checkRequestValidationError";
import mongoose from "mongoose";
import validators from "../validators";

export const message = [
    protectedRouteJWT,
    validators.param.chatId,
    validators.param.messageId,
    checkRequestValidationError,
    async (req: Request, res: Response) => {
        const { chatId, messageId } = req.params;

        /// create aggregation pipeline
        const aggregation: mongoose.PipelineStage[] = [];
        // find chat containing message
        aggregation.push({
            $match: {
                _id: new mongoose.Types.ObjectId(chatId),
                participants: {
                    $elemMatch: { user: new mongoose.Types.ObjectId(`${res.locals.user.id}`) },
                },
                messages: new mongoose.Types.ObjectId(messageId),
            },
        });
        // filter 'messages' array and populate message
        aggregation.push({
            $addFields: {
                message: {
                    $arrayElemAt: [
                        {
                            $filter: {
                                input: "$messages",
                                cond: { $eq: ["$$this", new mongoose.Types.ObjectId(messageId)] },
                            },
                        },
                        0,
                    ],
                },
            },
        });
        aggregation.push({
            $lookup: {
                from: "messages",
                localField: "message",
                foreignField: "_id",
                as: "message",
            },
        });
        aggregation.push({
            $addFields: {
                message: { $arrayElemAt: ["$message", 0] },
            },
        });
        // ensure the only remaining field in the projection is the message
        aggregation.push({
            $replaceRoot: {
                newRoot: { $mergeObjects: "$message" },
            },
        });
        // match the message's 'author' value against the active user's _id
        aggregation.push({
            $match: { author: new mongoose.Types.ObjectId(`${res.locals.user.id}`) },
        });
        // project only the message's _id
        aggregation.push({ $project: { _id: 1 } });

        const aggregationResult = await Chat.aggregate(aggregation).exec();
        if (aggregationResult.length === 0) {
            return sendResponse(res, 400, "Could not delete message");
        }

        const foundMessageId = aggregationResult[0]._id;

        // set message's 'deleted' field to 'true'
        const deletedMessage = await Message.updateOne(
            { _id: foundMessageId },
            { $set: { deleted: true } },
        );
        if (!deletedMessage.acknowledged) {
            return sendResponse(res, 500, "Could not delete message");
        }

        const response = await generateToken(res.locals.user)
            .then((token) => {
                return sendResponse(res, 200, "Message deleted successfully", { token });
            })
            .catch((tokenErr) => {
                return sendResponse(
                    res,
                    500,
                    tokenErr.message || "Message deleted successfully, but token creation failed",
                    null,
                    tokenErr,
                );
            });

        return response;
    },
];
