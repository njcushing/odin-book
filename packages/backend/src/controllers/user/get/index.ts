import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import protectedRouteJWT from "@/utils/protectedRouteJWT";
import sendResponse from "@/utils/sendResponse";
import generateToken from "@/utils/generateToken";
import User from "@/models/user";
import Post from "@/models/post";
import checkRequestValidationError from "@/utils/checkRequestValidationError";
import validators from "../validators";

export const active = [
    protectedRouteJWT,
    async (req: Request, res: Response) => {
        if (res.locals.user && "id" in res.locals.user && res.locals.user.id) {
            const userId = new mongoose.Types.ObjectId(res.locals.user.id as string);

            const aggregationResult = await User.aggregate([
                { $match: { _id: userId } },
                {
                    $project: {
                        accountTag: 1,
                        githubId: 1,
                        email: 1,
                        followingCount: { $size: "$following.users" },
                        followingRequestCount: { $size: "$following.users.requests" },
                        followersCount: { $size: "$followers.users" },
                        followersRequestCount: { $size: "$following.users.requests" },
                        postCount: { $size: "$posts" },
                        likesCount: { $size: "$likes" },
                        preferences: {
                            displayName: "$preferences.displayName",
                            bio: "$preferences.bio",
                            theme: "$preferences.theme",
                            // project profileImage even if it is not present in the document
                            profileImage: {
                                $cond: {
                                    if: {
                                        $eq: [{ $type: "$preferences.profileImage" }, "missing"],
                                    },
                                    then: null,
                                    else: "$preferences.profileImage",
                                },
                            },
                        },
                        creationDate: "$createdAt",
                    },
                },
                // find profileImage if possible
                {
                    $lookup: {
                        from: "images",
                        localField: "preferences.profileImage",
                        foreignField: "_id",
                        as: "preferences.profileImage",
                    },
                },
                {
                    $addFields: {
                        "preferences.profileImage": {
                            $cond: {
                                if: { $isArray: "$preferences.profileImage" },
                                then: { $arrayElemAt: ["$profileImage", 0] },
                                else: null,
                            },
                        },
                    },
                },
                // calculate the total number of replies
                {
                    $lookup: {
                        from: "posts",
                        localField: "posts",
                        foreignField: "_id",
                        as: "userPosts",
                    },
                },
                {
                    $addFields: {
                        repliesCount: {
                            $cond: [
                                { $gt: [{ $size: "$userPosts" }, 0] },
                                {
                                    $sum: {
                                        $map: {
                                            input: "$userPosts",
                                            as: "post",
                                            in: {
                                                $cond: [{ $ne: ["$$post.replyingTo", null] }, 1, 0],
                                            },
                                        },
                                    },
                                },
                                0,
                            ],
                        },
                        userPosts: "$$REMOVE",
                    },
                },
            ]);

            if (!aggregationResult || aggregationResult.length === 0) {
                sendResponse(res, 404, "User not found in database");
            } else {
                const user = aggregationResult[0];
                const token = await generateToken({ ...res.locals.user._doc });
                sendResponse(res, 200, "User found", { user, token });
            }
        } else {
            sendResponse(res, 400, "No valid user id provided in token payload");
        }
    },
];

export const posts = [
    protectedRouteJWT,
    validators.param.userId,
    validators.query.limit,
    validators.query.after,
    validators.query.repliesOnly,
    checkRequestValidationError,
    asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;
        const { limit, after, repliesOnly } = req.query;

        /*
         *  When requesting a post at the top-level, the following fields should be returned:
         *  - '_id', 'text', 'createdAt', 'replyingTo' as normal
         *  - 'images' documents populated
         *  - 'likesCount' and 'repliesCount' - size of 'likes' and 'replies' arrays, respectively
         *  - 'likedByUser' - boolean value identifying whether the active user has liked the post
         */

        /// create aggregation pipeline
        const aggregation: mongoose.PipelineStage[] = [];
        // match user, unwind & populate posts
        aggregation.push(
            { $match: { _id: new mongoose.Types.ObjectId(userId) } },
            { $unwind: "$posts" },
            {
                $lookup: {
                    from: "posts",
                    localField: "posts",
                    foreignField: "_id",
                    as: "populatedPosts",
                },
            },
        );
        // if 'after' query parameter is specified, check post exists and is owned by specified user
        let responding = false;
        if (after) {
            const afterPost = await Post.findById(after);
            if (!afterPost) {
                sendResponse(res, 404, "Specified 'after' post not found in the database");
                responding = true;
            } else if (afterPost.owner.toString() !== userId) {
                sendResponse(
                    res,
                    400,
                    "Specified 'after' post exists, but it is not owned by the specified user",
                );
                responding = true;
            } else {
                // if so, filter posts based on their creation date being after the 'after' post
                aggregation.push({
                    $match: {
                        "populatedPosts.createdAt": { $lt: afterPost.createdAt },
                    },
                });
            }
        }
        // if 'repliesOnly' query parameter is specified as 'true', filter out non-replies
        if (repliesOnly) {
            aggregation.push({
                $match: {
                    $and: [
                        { "populatedPosts.replyingTo": { $exists: true } },
                        { "populatedPosts.replyingTo": { $type: "objectId" } },
                    ],
                },
            });
        }
        if (!responding) {
            // sort & limit posts
            aggregation.push({ $sort: { "populatedPosts.createdAt": -1 } });
            if (limit) aggregation.push({ $limit: Number(limit) });
            // group results back into posts array
            aggregation.push(
                { $unwind: "$populatedPosts" },
                {
                    $group: {
                        _id: "$_id",
                        posts: { $push: "$populatedPosts" },
                    },
                },
            );
            // add new fields: 'likesCount', 'repliesCount' and 'likedByUser' to all posts
            aggregation.push({
                $addFields: {
                    posts: {
                        $map: {
                            input: "$posts",
                            as: "post",
                            in: {
                                $mergeObjects: [
                                    "$$post",
                                    {
                                        likesCount: { $size: "$$post.likes" },
                                        repliesCount: { $size: "$$post.replies" },
                                        likedByUser: {
                                            $cond: {
                                                if: {
                                                    $in: [
                                                        new mongoose.Types.ObjectId(
                                                            res.locals.user.id as string,
                                                        ),
                                                        "$$post.likes",
                                                    ],
                                                },
                                                then: true,
                                                else: false,
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            });
            // final projection
            aggregation.push({
                $project: {
                    posts: {
                        _id: 1,
                        owner: 1,
                        text: 1,
                        images: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        likesCount: 1,
                        repliesCount: 1,
                        likedByUser: 1,
                    },
                },
            });
            // execute aggregation
            const aggregationResult = await User.aggregate(aggregation).exec();
            if (aggregationResult.length === 0) {
                sendResponse(res, 404, "Could not find posts");
            } else {
                const userPosts = aggregationResult[0].posts;
                await generateToken(res.locals.user)
                    .then((token) => {
                        sendResponse(res, 200, "Posts found", { token, posts: userPosts });
                    })
                    .catch((tokenErr) => {
                        sendResponse(
                            res,
                            500,
                            tokenErr.message || `Posts found, but token creation failed`,
                            { posts: userPosts },
                            tokenErr,
                        );
                    });
            }
        }
    }),
];
