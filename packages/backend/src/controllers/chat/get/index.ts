import { Request, Response } from "express";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import generateToken from "@/utils/generateToken";
import sendResponse from "@/utils/sendResponse";
import protectedRouteJWT from "@/utils/protectedRouteJWT";
import Chat from "@/models/chat";
import Message from "@/models/message";
import checkRequestValidationError from "@/utils/checkRequestValidationError";
import validators from "../validators";

export const overview = [
    protectedRouteJWT,
    validators.param.chatId,
    checkRequestValidationError,
    asyncHandler(async (req: Request, res: Response) => {
        const { chatId } = req.params;

        /*
         *  When requesting a chat at the summary-level, the following fields should be projected:
         *  - '_id', 'name', 'createdAt' as normal
         *  - 'image' document populated, projecting its '_id', 'url' and 'alt' fields
         *  - 'recentMessage' - the most recent message document populated, projecting '_id',
         *    'author', 'text' (hidden if the post is deleted), 'imageCount' (quantity of images in
         *    the message) and 'deleted' fields
         *  - 'participants' - projecting their 'user' and 'nickname' fields, with 'user' populated,
         *    projecting its '_id', 'accountTag' and 'preferences.displayName' fields
         */

        const aggregationResult = await Chat.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(chatId) } },
            // populate all participants.user documents
            { $unwind: "$participants" },
            {
                $lookup: {
                    from: "users",
                    localField: "participants.user",
                    foreignField: "_id",
                    as: "participants.user",
                },
            },
            { $addFields: { "participants.user": { $arrayElemAt: ["$participants.user", 0] } } },
            {
                $group: {
                    _id: "$_id",
                    otherFields: { $first: "$$ROOT" },
                    participants: { $push: "$participants" },
                },
            },
            { $addFields: { "otherFields.participants": "$participants" } },
            { $replaceRoot: { newRoot: "$otherFields" } },
            // project
            {
                $project: {
                    _id: 1,
                    participants: {
                        $map: {
                            input: "$participants",
                            as: "participant",
                            in: {
                                user: {
                                    _id: "$$participant.user._id",
                                    accountTag: "$$participant.user.accountTag",
                                    preferences: {
                                        displayName: "$$participant.user.preferences.displayName",
                                    },
                                },
                                nickname: "$$participant.nickname",
                            },
                        },
                    },
                    name: 1,
                    // project image even if it is not present in the document
                    image: {
                        $cond: {
                            if: {
                                $eq: [{ $type: "$image" }, "missing"],
                            },
                            then: null,
                            else: "$image",
                        },
                    },
                    recentMessage: {
                        $cond: {
                            if: { $eq: [{ $size: "$messages" }, 0] },
                            then: null,
                            else: { $arrayElemAt: ["$messages", 0] },
                        },
                    },
                    createdAt: 1,
                },
            },
            // populate 'image' field if possible
            {
                $lookup: {
                    from: "images",
                    localField: "image",
                    foreignField: "_id",
                    as: "image",
                },
            },
            {
                $addFields: {
                    image: {
                        $cond: {
                            if: { $gt: [{ $size: "$image" }, 0] },
                            then: { $arrayElemAt: ["$image", 0] },
                            else: null,
                        },
                    },
                },
            },
            // populate 'recentMessage' field, if possible
            {
                $lookup: {
                    from: "messages",
                    localField: "recentMessage",
                    foreignField: "_id",
                    as: "recentMessage",
                },
            },
            {
                $addFields: {
                    recentMessage: {
                        $cond: {
                            if: { $gt: [{ $size: "$recentMessage" }, 0] },
                            then: { $arrayElemAt: ["$recentMessage", 0] },
                            else: null,
                        },
                    },
                },
            },
            // project (to clean up fields in newly-populated 'image' and 'recentMessage' documents)
            {
                $project: {
                    _id: 1,
                    participants: 1,
                    name: 1,
                    image: {
                        $cond: {
                            if: { $eq: ["$image", null] },
                            then: null,
                            else: {
                                _id: "$image._id",
                                url: "$image.url",
                                alt: "$image.alt",
                            },
                        },
                    },
                    recentMessage: {
                        $cond: {
                            if: { $eq: ["$recentMessage", null] },
                            then: null,
                            else: {
                                _id: "$recentMessage._id",
                                author: "$recentMessage.author",
                                text: {
                                    $cond: {
                                        if: "$recentMessage.deleted",
                                        then: "", // hiding text in case of deleted message
                                        else: "$recentMessage.text",
                                    },
                                },
                                imageCount: { $size: "$recentMessage.images" },
                                deleted: "$recentMessage.deleted",
                            },
                        },
                    },
                    createdAt: 1,
                },
            },
        ]);

        if (aggregationResult.length === 0) {
            sendResponse(res, 404, "Could not find chat");
        } else {
            const foundChat = aggregationResult[0];
            await generateToken(res.locals.user)
                .then((token) => {
                    sendResponse(res, 200, "Chat found", { token, chat: foundChat });
                })
                .catch((tokenErr) => {
                    sendResponse(
                        res,
                        500,
                        tokenErr.message || `Chat found, but token creation failed`,
                        { chat: foundChat },
                        tokenErr,
                    );
                });
        }
    }),
];

export const messages = [
    protectedRouteJWT,
    validators.param.chatId,
    validators.query.limit,
    validators.query.after,
    checkRequestValidationError,
    asyncHandler(async (req: Request, res: Response) => {
        const { chatId } = req.params;
        const { limit, after } = req.query;

        /// create aggregation pipeline
        const aggregation: mongoose.PipelineStage[] = [];
        // match chat, unwind & populate messages
        aggregation.push(
            // only match the chat if the active user is a participant of the chat
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(chatId),
                    participants: {
                        $elemMatch: { user: new mongoose.Types.ObjectId(`${res.locals.user.id}`) },
                    },
                },
            },
            { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
            // if the 'messages' array is empty, it will not be present on the document at this stage
            {
                $addFields: {
                    messages: {
                        $cond: {
                            if: { $eq: [{ $type: "$messages" }, "missing"] },
                            then: [],
                            else: "$messages",
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "messages",
                    foreignField: "_id",
                    as: "populatedMessages",
                },
            },
        );
        // if 'after' query parameter is specified, check message exists
        let responding = false;
        if (after) {
            const afterMessage = await Message.findById(after);
            if (!afterMessage) {
                sendResponse(res, 404, "Specified 'after' message not found in the database");
                responding = true;
            } else {
                // if so, check message is within likes array
                aggregation.push({
                    $match: { populatedMessages: { $elemMatch: { _id: afterMessage._id } } },
                });
                // and filter messages based on their creation date being after the 'after' message
                aggregation.push({
                    $match: {
                        "populatedMessages.createdAt": { $lt: afterMessage.createdAt },
                    },
                });
            }
        }
        if (!responding) {
            // sort & limit messages
            aggregation.push({ $sort: { "populatedMessages.createdAt": -1 } });
            if (limit) aggregation.push({ $limit: Number(limit) });
            // group results back into messages array
            aggregation.push(
                { $unwind: { path: "$populatedMessages", preserveNullAndEmptyArrays: true } },
                {
                    $group: {
                        _id: "$_id",
                        messages: { $push: "$populatedMessages" },
                    },
                },
            );
            // execute aggregation
            const aggregationResult = await Chat.aggregate(aggregation).exec();
            if (aggregationResult.length === 0) {
                sendResponse(res, 404, "Could not find messages");
            } else {
                const chatMessages = aggregationResult[0].messages;
                await generateToken(res.locals.user)
                    .then((token) => {
                        sendResponse(res, 200, "Messages found", { token, messages: chatMessages });
                    })
                    .catch((tokenErr) => {
                        sendResponse(
                            res,
                            500,
                            tokenErr.message || `Messages found, but token creation failed`,
                            { messages: chatMessages },
                            tokenErr,
                        );
                    });
            }
        }
    }),
];
