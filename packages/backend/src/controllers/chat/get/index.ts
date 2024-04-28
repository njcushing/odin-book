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
                                imageCount: {
                                    $cond: {
                                        if: "$recentMessage.deleted",
                                        then: 0, // hiding image count in case of deleted message
                                        else: { $size: "$recentMessage.images" },
                                    },
                                },
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
    validators.query.before,
    checkRequestValidationError,
    asyncHandler(async (req: Request, res: Response) => {
        const { chatId } = req.params;
        const { limit, before } = req.query;

        /// create aggregation pipeline
        const aggregation: mongoose.PipelineStage[] = [];
        // match chat
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
        );
        // if 'before' query parameter is specified, check message is within messages array
        if (before) {
            aggregation.push({
                $match: { messages: new mongoose.Types.ObjectId(`${before}`) },
            });
        }
        // unwind & populate messages
        aggregation.push(
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
                    from: "messages",
                    localField: "messages",
                    foreignField: "_id",
                    as: "populatedMessages",
                },
            },
        );
        // if 'before' query parameter is specified, check message exists
        let responding = false;
        if (before) {
            const beforeMessage = await Message.findById(before);
            if (!beforeMessage) {
                sendResponse(res, 404, "Specified 'before' message not found in the database");
                responding = true;
            } else {
                // and filter messages based on their creation date being before the 'before' message
                aggregation.push({
                    $match: {
                        "populatedMessages.createdAt": { $lt: beforeMessage.createdAt },
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
            // project
            aggregation.push({
                $project: {
                    messages: {
                        $map: {
                            input: "$messages",
                            as: "message",
                            in: {
                                _id: "$$message._id",
                                author: "$$message.author",
                                imageCount: {
                                    $cond: {
                                        if: "$$message.deleted",
                                        then: 0, // hiding image count in case of deleted message
                                        else: { $size: "$$message.images" },
                                    },
                                },
                                replyingTo: {
                                    $cond: {
                                        if: {
                                            $or: [
                                                {
                                                    $eq: [
                                                        { $type: "$$message.replyingTo" },
                                                        "missing",
                                                    ],
                                                },
                                                "$$message.deleted", // hiding replyingTo in case of deleted message
                                            ],
                                        },
                                        then: null,
                                        else: "$$message.replyingTo",
                                    },
                                },
                                deleted: "$$message.deleted",
                                createdAt: "$$message.createdAt",
                            },
                        },
                    },
                },
            });
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

export const message = [
    protectedRouteJWT,
    validators.param.chatId,
    validators.param.messageId,
    checkRequestValidationError,
    asyncHandler(async (req: Request, res: Response) => {
        const { chatId, messageId } = req.params;

        /*
         *  When requesting a message, the following fields should be projected:
         *  - '_id', 'text', 'deleted', 'createdAt' as normal
         *  - 'images' documents populated, projecting their '_id', 'url' and 'alt' fields
         *  - 'author' populated, projecting '_id', 'accountTag', 'preferences.displayName' and
         *    'preferences.profileImage' fields, with the latter populated, projecting the same
         *    fields as the 'images' documents
         *  - 'replyingTo' document populated, projecting the same fields as the message being
         *    requested, with the exception that its own 'replyingTo' field document is NOT
         *    populated
         *
         *  - if the message's 'deleted' field is 'true', obscure the 'text', 'images' and
         *    'replyingTo' fields; the same applies to the 'replyingTo' field if its 'deleted' field
         *    is 'true'
         */

        /// create aggregation pipeline
        const aggregation: mongoose.PipelineStage[] = [];
        /*
         *  Only match the chat if:
         *  - the active user is a participant of the specified chat
         *  - the specified message is contained within the specified chat
         */
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
        // populate 'author' field & 'author.preferences.profileImage' field
        aggregation.push({
            $lookup: { from: "users", localField: "author", foreignField: "_id", as: "author" },
        });
        aggregation.push({ $addFields: { author: { $arrayElemAt: ["$author", 0] } } });
        aggregation.push({
            $lookup: {
                from: "images",
                localField: "author.preferences.profileImage",
                foreignField: "_id",
                as: "author.preferences.profileImage",
            },
        });
        aggregation.push({
            $addFields: {
                "author.preferences.profileImage": {
                    $cond: {
                        if: { $eq: [{ $size: "$author.preferences.profileImage" }, 0] },
                        then: null,
                        else: { $arrayElemAt: ["$author.preferences.profileImage", 0] },
                    },
                },
            },
        });
        // populate 'images' field
        aggregation.push(
            { $unwind: { path: "$images", preserveNullAndEmptyArrays: true } },
            // if the 'images' array is empty, it will not be present on the document at this stage
            {
                $addFields: {
                    postImages: {
                        $cond: {
                            if: { $eq: [{ $type: "$images" }, "missing"] },
                            then: [],
                            else: "$images",
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "images",
                    localField: "images",
                    foreignField: "_id",
                    as: "images",
                },
            },
            { $unwind: { path: "$images", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: "$_id",
                    otherFields: { $first: "$$ROOT" },
                    images: { $push: "$images" },
                },
            },
            { $addFields: { "otherFields.images": "$images" } },
            { $replaceRoot: { newRoot: "$otherFields" } },
        );
        // populate 'replyingTo' field
        aggregation.push({
            $lookup: {
                from: "messages",
                localField: "replyingTo",
                foreignField: "_id",
                as: "replyingTo",
            },
        });
        aggregation.push({
            $addFields: {
                replyingTo: {
                    $cond: {
                        if: { $eq: [{ $size: "$replyingTo" }, 0] },
                        then: null,
                        else: { $arrayElemAt: ["$replyingTo", 0] },
                    },
                },
            },
        });
        // populate 'replyingTo.author' field & 'replyingTo.author.preferences.profileImage' field
        aggregation.push({
            $lookup: {
                from: "users",
                localField: "replyingTo.author",
                foreignField: "_id",
                as: "replyingToAuthor",
            },
        });
        aggregation.push({
            $addFields: { replyingToAuthor: { $arrayElemAt: ["$replyingToAuthor", 0] } },
        });
        aggregation.push({
            $lookup: {
                from: "images",
                localField: "replyingTo.author.preferences.profileImage",
                foreignField: "_id",
                as: "replyingToAuthorProfileImage",
            },
        });
        aggregation.push({
            $addFields: {
                replyingToAuthorProfileImage: {
                    $cond: {
                        if: { $eq: [{ $size: "$replyingToAuthorProfileImage" }, 0] },
                        then: null,
                        else: { $arrayElemAt: ["$replyingToAuthorProfileImage", 0] },
                    },
                },
            },
        });
        // populate 'replyingTo.images' field
        aggregation.push({
            $lookup: {
                from: "images",
                localField: "replyingTo.images",
                foreignField: "_id",
                as: "replyingToImages",
            },
        });
        // project
        aggregation.push({
            $project: {
                _id: 1,
                author: {
                    _id: 1,
                    accountTag: 1,
                    preferences: {
                        displayName: 1,
                        profileImage: {
                            $cond: {
                                if: { $eq: ["$author.preferences.profileImage", null] },
                                then: null,
                                else: {
                                    _id: "$author.preferences.profileImage._id",
                                    url: "$author.preferences.profileImage.url",
                                    alt: "$author.preferences.profileImage.alt",
                                },
                            },
                        },
                    },
                },
                text: {
                    $cond: {
                        if: "$deleted",
                        then: "", // hiding text in case of deleted message
                        else: "$text",
                    },
                },
                images: {
                    $cond: {
                        if: "$deleted",
                        then: [], // hiding images in case of deleted message
                        else: {
                            $map: {
                                input: "$images",
                                as: "image",
                                in: {
                                    _id: "$$image._id",
                                    url: "$$image.url",
                                    alt: "$$image.alt",
                                },
                            },
                        },
                    },
                },
                replyingTo: {
                    $cond: {
                        if: {
                            $or: [
                                { $eq: ["$replyingTo", null] },
                                "$deleted", // hiding replyingTo in case of deleted message
                            ],
                        },
                        then: null,
                        else: {
                            _id: "$replyingTo._id",
                            author: {
                                _id: "$replyingToAuthor._id",
                                accountTag: "$replyingToAuthor.accountTag",
                                preferences: {
                                    displayName: "$replyingToAuthor.preferences.displayName",
                                    profileImage: {
                                        $cond: {
                                            if: {
                                                $eq: ["$replyingToAuthorProfileImage", null],
                                            },
                                            then: null,
                                            else: {
                                                _id: "$replyingToAuthorProfileImage._id",
                                                url: "$replyingToAuthorProfileImage.url",
                                                alt: "$replyingToAuthorProfileImage.alt",
                                            },
                                        },
                                    },
                                },
                            },
                            text: {
                                $cond: {
                                    if: "$replyingTo.deleted",
                                    then: "", // hiding text in case of deleted message
                                    else: "$replyingTo.text",
                                },
                            },
                            images: {
                                $cond: {
                                    if: "$replyingTo.deleted",
                                    then: [], // hiding images in case of deleted message
                                    else: {
                                        $map: {
                                            input: "$replyingToImages",
                                            as: "image",
                                            in: {
                                                _id: "$$image._id",
                                                url: "$$image.url",
                                                alt: "$$image.alt",
                                            },
                                        },
                                    },
                                },
                            },
                            replyingTo: {
                                $cond: {
                                    if: "$replyingTo.deleted",
                                    then: null, // hiding replyingTo in case of deleted message
                                    else: "$replyingTo.replyingTo",
                                },
                            },
                            deleted: "$replyingTo.deleted",
                            createdAt: "$replyingTo.createdAt",
                        },
                    },
                },
                deleted: 1,
                createdAt: 1,
            },
        });
        // execute aggregation
        const aggregationResult = await Chat.aggregate(aggregation).exec();
        if (aggregationResult.length === 0) {
            sendResponse(res, 404, "Could not find message");
        } else {
            const foundMessage = aggregationResult[0];
            await generateToken(res.locals.user)
                .then((token) => {
                    sendResponse(res, 200, "Message found", { token, message: foundMessage });
                })
                .catch((tokenErr) => {
                    sendResponse(
                        res,
                        500,
                        tokenErr.message || `Message found, but token creation failed`,
                        { message: foundMessage },
                        tokenErr,
                    );
                });
        }
    }),
];
