import { Request, Response } from "express";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import generateToken from "@/utils/generateToken";
import sendResponse from "@/utils/sendResponse";
import protectedRouteJWT from "@/utils/protectedRouteJWT";
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
                likedByUser: { $in: [res.locals.user.id, "$likes"] },
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
