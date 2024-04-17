import { Request, Response } from "express";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import generateToken from "@/utils/generateToken";
import sendResponse from "@/utils/sendResponse";
import protectedRouteJWT from "@/utils/protectedRouteJWT";
import User from "@/models/user";
import Post from "@/models/post";
import checkRequestValidationError from "@/utils/checkRequestValidationError";
import validators from "../validators";

export const regular = [
    protectedRouteJWT,
    validators.param.postId,
    checkRequestValidationError,
    asyncHandler(async (req: Request, res: Response) => {
        const { postId } = req.params;

        /*
         *  When requesting a post at the top-level, the following fields should be projected:
         *  - '_id', 'text', 'createdAt', 'replyingTo' as normal
         *  - 'images' documents populated, projecting their '_id', 'url' and 'alt' fields
         *  - 'likesCount' and 'repliesCount' - size of 'likes' and 'replies' arrays, respectively
         *  - 'likedByUser' - boolean value identifying whether the active user has liked the post
         *  - 'author' populated, projecting '_id', 'accountTag', 'preferences.displayName' and
         *    'preferences.profileImage' fields, with 'preferences.profileImage' populated,
         *    projecting the same fields as the 'images' documents
         */

        /// create aggregation pipeline
        const aggregation: mongoose.PipelineStage[] = [];
        // match post
        aggregation.push({ $match: { _id: new mongoose.Types.ObjectId(postId) } });
        // populate 'author' field & preferences.profileImage field
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
        aggregation.push({
            $lookup: { from: "images", localField: "images", foreignField: "_id", as: "images" },
        });
        // project and add new fields: 'likesCount', 'repliesCount' and 'likedByUser'
        aggregation.push({
            $project: {
                _id: 1,
                author: {
                    _id: "$author._id",
                    accountTag: "$author.accountTag",
                    preferences: {
                        displayName: "$author.preferences.displayName",
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
                text: 1,
                images: {
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
                replyingTo: 1,
                createdAt: 1,
                likesCount: { $size: "$likes" },
                repliesCount: { $size: "$replies" },
                likedByUser: {
                    $in: [new mongoose.Types.ObjectId(`${res.locals.user.id}`), "$likes"],
                },
            },
        });
        // execute aggregation
        const aggregationResult = await Post.aggregate(aggregation).exec();
        if (aggregationResult.length === 0) {
            sendResponse(res, 404, "Could not find post");
        } else {
            const foundPost = aggregationResult[0];
            await generateToken(res.locals.user)
                .then((token) => {
                    sendResponse(res, 200, "Post found", { token, post: foundPost });
                })
                .catch((tokenErr) => {
                    sendResponse(
                        res,
                        500,
                        tokenErr.message || `Post found, but token creation failed`,
                        { post: foundPost },
                        tokenErr,
                    );
                });
        }
    }),
];

export const likes = [
    protectedRouteJWT,
    validators.param.postId,
    validators.query.limit,
    validators.query.after,
    checkRequestValidationError,
    asyncHandler(async (req: Request, res: Response) => {
        const { postId } = req.params;
        const { limit, after } = req.query;

        /// create aggregation pipeline
        const aggregation: mongoose.PipelineStage[] = [];
        // match post, unwind & populate likes
        aggregation.push(
            { $match: { _id: new mongoose.Types.ObjectId(postId) } },
            { $unwind: { path: "$likes", preserveNullAndEmptyArrays: true } },
            // if the 'likes' array is empty, it will not be present on the document at this stage
            {
                $addFields: {
                    postLikes: {
                        $cond: {
                            if: { $eq: [{ $type: "$likes" }, "missing"] },
                            then: [],
                            else: "$likes",
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "postLikes",
                    foreignField: "_id",
                    as: "populatedLikes",
                },
            },
        );
        // if 'after' query parameter is specified, check user exists
        let responding = false;
        if (after) {
            const afterUser = await User.findById(after);
            if (!afterUser) {
                sendResponse(res, 404, "Specified 'after' user not found in the database");
                responding = true;
            } else {
                // if so, check user is within likes array
                aggregation.push({
                    $match: { populatedLikes: { $elemMatch: { _id: afterUser._id } } },
                });
                // and filter users based on their creation date being after the 'after' user
                aggregation.push({
                    $match: {
                        "populatedLikes.createdAt": { $lt: afterUser.createdAt },
                    },
                });
            }
        }
        if (!responding) {
            // sort & limit likes
            aggregation.push({ $sort: { "populatedLikes.createdAt": -1 } });
            if (limit) aggregation.push({ $limit: Number(limit) });
            // group results back into postLikes array
            aggregation.push(
                { $unwind: { path: "$populatedLikes", preserveNullAndEmptyArrays: true } },
                {
                    $group: {
                        _id: "$_id",
                        postLikes: { $push: "$populatedLikes" },
                    },
                },
            );
            // final projection
            aggregation.push({ $project: { _id: 0, postLikes: "$postLikes._id" } });
            // execute aggregation
            const aggregationResult = await Post.aggregate(aggregation).exec();
            if (aggregationResult.length === 0) {
                sendResponse(res, 404, "Could not find post likes");
            } else {
                const { postLikes } = aggregationResult[0];
                await generateToken(res.locals.user)
                    .then((token) => {
                        sendResponse(res, 200, "Post likes found", {
                            token,
                            likes: postLikes,
                        });
                    })
                    .catch((tokenErr) => {
                        sendResponse(
                            res,
                            500,
                            tokenErr.message || `Post likes found, but token creation failed`,
                            { likes: postLikes },
                            tokenErr,
                        );
                    });
            }
        }
    }),
];

export const replies = [
    protectedRouteJWT,
    validators.param.postId,
    validators.query.limit,
    validators.query.after,
    checkRequestValidationError,
    asyncHandler(async (req: Request, res: Response) => {
        const { postId } = req.params;
        const { limit, after } = req.query;

        /// create aggregation pipeline
        const aggregation: mongoose.PipelineStage[] = [];
        // match post, unwind & populate replies
        aggregation.push(
            { $match: { _id: new mongoose.Types.ObjectId(postId) } },
            { $unwind: { path: "$replies", preserveNullAndEmptyArrays: true } },
            // if the 'replies' array is empty, it will not be present on the document at this stage
            {
                $addFields: {
                    postReplies: {
                        $cond: {
                            if: { $eq: [{ $type: "$replies" }, "missing"] },
                            then: [],
                            else: "$replies",
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "postReplies",
                    foreignField: "_id",
                    as: "populatedReplies",
                },
            },
        );
        // if 'after' query parameter is specified, check reply exists
        let responding = false;
        if (after) {
            const afterPost = await Post.findById(after);
            if (!afterPost) {
                sendResponse(res, 404, "Specified 'after' post not found in the database");
                responding = true;
            } else {
                // if so, check post is within replies array
                aggregation.push({
                    $match: { populatedReplies: { $elemMatch: { _id: afterPost._id } } },
                });
                // and filter posts based on their creation date being after the 'after' post
                aggregation.push({
                    $match: {
                        "populatedReplies.createdAt": { $lt: afterPost.createdAt },
                    },
                });
            }
        }
        if (!responding) {
            // sort & limit replies
            aggregation.push({ $sort: { "populatedReplies.createdAt": -1 } });
            if (limit) aggregation.push({ $limit: Number(limit) });
            // group results back into postReplies array
            aggregation.push(
                { $unwind: { path: "$populatedReplies", preserveNullAndEmptyArrays: true } },
                {
                    $group: {
                        _id: "$_id",
                        postReplies: { $push: "$populatedReplies" },
                    },
                },
            );
            // final projection
            aggregation.push({ $project: { _id: 0, postReplies: "$postReplies._id" } });
            // execute aggregation
            const aggregationResult = await Post.aggregate(aggregation).exec();
            if (aggregationResult.length === 0) {
                sendResponse(res, 404, "Could not find post replies");
            } else {
                const { postReplies } = aggregationResult[0];
                await generateToken(res.locals.user)
                    .then((token) => {
                        sendResponse(res, 200, "Post replies found", {
                            token,
                            replies: postReplies,
                        });
                    })
                    .catch((tokenErr) => {
                        sendResponse(
                            res,
                            500,
                            tokenErr.message || `Post replies found, but token creation failed`,
                            { replies: postReplies },
                            tokenErr,
                        );
                    });
            }
        }
    }),
];
