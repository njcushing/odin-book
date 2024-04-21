import { Request, Response } from "express";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import generateToken from "@/utils/generateToken";
import sendResponse from "@/utils/sendResponse";
import protectedRouteJWT from "@/utils/protectedRouteJWT";
import Chat from "@/models/chat";
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
         *    'author', 'text', 'images' and 'deleted' fields
         *  - 'participants' - projecting their 'user' and 'nickname' fields, with 'user' populated,
         *    projecting its '_id', 'accountTag' and 'preferences.displayName' fields
         */

        const aggregationResult = await Chat.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(chatId) } },
            // populate all participants documents
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
