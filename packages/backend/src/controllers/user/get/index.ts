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

export const idFromTag = [
    protectedRouteJWT,
    validators.query.accountTag,
    checkRequestValidationError,
    asyncHandler(async (req: Request, res: Response) => {
        const { accountTag } = req.query;
        // find user
        const user = await User.findOne({ accountTag }, { _id: 1 }).lean({ virtuals: false });
        if (!user) {
            sendResponse(res, 404, "User not found in database");
        } else {
            await generateToken(res.locals.user)
                .then((token) => {
                    sendResponse(res, 200, "User found", { token, _id: user._id });
                })
                .catch((tokenErr) => {
                    sendResponse(
                        res,
                        500,
                        tokenErr.message || `User found, but token creation failed`,
                        { _id: user._id },
                        tokenErr,
                    );
                });
        }
    }),
];

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

        /// create aggregation pipeline
        const aggregation: mongoose.PipelineStage[] = [];
        // match user, unwind & populate posts
        aggregation.push(
            { $match: { _id: new mongoose.Types.ObjectId(userId) } },
            { $unwind: { path: "$posts", preserveNullAndEmptyArrays: true } },
            // if the 'posts' array is empty, it will not be present on the document at this stage
            {
                $addFields: {
                    posts: {
                        $cond: {
                            if: { $eq: [{ $type: "$posts" }, "missing"] },
                            then: [],
                            else: "$posts",
                        },
                    },
                },
            },
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
            } else if (afterPost.author.toString() !== userId) {
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
                { $unwind: { path: "$populatedPosts", preserveNullAndEmptyArrays: true } },
                {
                    $group: {
                        _id: "$_id",
                        posts: { $push: "$populatedPosts" },
                    },
                },
            );
            // final projection
            aggregation.push({
                $project: {
                    posts: {
                        _id: 1,
                        replyingTo: 1,
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

export const likes = [
    protectedRouteJWT,
    validators.param.userId,
    validators.query.limit,
    validators.query.after,
    checkRequestValidationError,
    asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;
        const { limit, after } = req.query;

        /// create aggregation pipeline
        const aggregation: mongoose.PipelineStage[] = [];
        // match user, unwind & populate likes
        aggregation.push(
            { $match: { _id: new mongoose.Types.ObjectId(userId) } },
            { $unwind: { path: "$likes", preserveNullAndEmptyArrays: true } },
            // if the 'likes' array is empty, it will not be present on the document at this stage
            {
                $addFields: {
                    likes: {
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
                    from: "posts",
                    localField: "likes",
                    foreignField: "_id",
                    as: "populatedLikes",
                },
            },
        );
        // if 'after' query parameter is specified, check post exists
        let responding = false;
        if (after) {
            const afterPost = await Post.findById(after);
            if (!afterPost) {
                sendResponse(res, 404, "Specified 'after' post not found in the database");
                responding = true;
            } else {
                // if so, check post is within likes array
                aggregation.push({
                    $match: { populatedLikes: { $elemMatch: { _id: afterPost._id } } },
                });
                // and filter likes based on their creation date being after the 'after' post
                aggregation.push({
                    $match: {
                        "populatedLikes.createdAt": { $lt: afterPost.createdAt },
                    },
                });
            }
        }
        if (!responding) {
            // sort & limit likes
            aggregation.push({ $sort: { "populatedLikes.createdAt": -1 } });
            if (limit) aggregation.push({ $limit: Number(limit) });
            // group results back into likes array
            aggregation.push(
                { $unwind: { path: "$populatedLikes", preserveNullAndEmptyArrays: true } },
                {
                    $group: {
                        _id: "$_id",
                        likes: { $push: "$populatedLikes" },
                    },
                },
            );
            // final projection
            aggregation.push({
                $project: {
                    likes: {
                        _id: 1,
                        replyingTo: 1,
                    },
                },
            });
            // execute aggregation
            const aggregationResult = await User.aggregate(aggregation).exec();
            if (aggregationResult.length === 0) {
                sendResponse(res, 404, "Could not find likes");
            } else {
                const userLikes = aggregationResult[0].likes;
                await generateToken(res.locals.user)
                    .then((token) => {
                        sendResponse(res, 200, "Likes found", { token, likes: userLikes });
                    })
                    .catch((tokenErr) => {
                        sendResponse(
                            res,
                            500,
                            tokenErr.message || `Likes found, but token creation failed`,
                            { likes: userLikes },
                            tokenErr,
                        );
                    });
            }
        }
    }),
];

export const option = [
    protectedRouteJWT,
    validators.param.userId,
    checkRequestValidationError,
    asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;

        /// create aggregation pipeline
        const aggregation: mongoose.PipelineStage[] = [];
        // match user, unwind & populate likes
        aggregation.push(
            { $match: { _id: new mongoose.Types.ObjectId(userId) } },
            {
                $project: {
                    _id: 1,
                    accountTag: 1,
                    preferences: {
                        displayName: "$preferences.displayName",
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
                    isFollowing: {
                        $in: [
                            new mongoose.Types.ObjectId(`${res.locals.user.id}`),
                            "$followers.users",
                        ],
                    },
                },
            },
        );
        // execute aggregation
        const aggregationResult = await User.aggregate(aggregation).exec();
        if (aggregationResult.length === 0) {
            sendResponse(res, 404, "Could not find user");
        } else {
            const user = aggregationResult[0];
            await generateToken(res.locals.user)
                .then((token) => {
                    sendResponse(res, 200, "User found", { token, user });
                })
                .catch((tokenErr) => {
                    sendResponse(
                        res,
                        500,
                        tokenErr.message || `User found, but token creation failed`,
                        { user },
                        tokenErr,
                    );
                });
        }
    }),
];
