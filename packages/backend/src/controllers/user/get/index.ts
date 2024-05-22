import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import protectedRouteJWT from "@/utils/protectedRouteJWT";
import sendResponse from "@/utils/sendResponse";
import generateToken from "@/utils/generateToken";
import User from "@/models/user";
import Post from "@/models/post";
import Chat from "@/models/chat";
import validation from "@shared/validation";
import { query } from "express-validator";
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

export const overviewFromTag = [
    protectedRouteJWT,
    validators.query.softCheck,
    query("accountTag").custom((value, { req }) => {
        const softCheck = req.query && req.query.softCheck;
        if (!softCheck || softCheck === "false") {
            const valid = validation.user.accountTag(value, "front");
            if (!valid.status) {
                throw new Error(valid.message);
            }
        }
        return true;
    }),
    checkRequestValidationError,
    asyncHandler(async (req: Request, res: Response) => {
        const { accountTag, softCheck } = req.query;
        // find user
        const user = await User.findOne(
            { accountTag },
            { _id: 1, accountTag: 1, "preferences.displayName": 1, "preferences.profileImage": 1 },
        ).lean({ virtuals: false });
        if (!user) {
            sendResponse(res, softCheck ? 204 : 404, "User not found in database");
        } else {
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
                            // project headerImage even if it is not present in the document
                            headerImage: {
                                $cond: {
                                    if: {
                                        $eq: [{ $type: "$preferences.headerImage" }, "missing"],
                                    },
                                    then: null,
                                    else: "$preferences.headerImage",
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
                                then: { $arrayElemAt: ["$preferences.profileImage", 0] },
                                else: null,
                            },
                        },
                    },
                },
                // find headerImage if possible
                {
                    $lookup: {
                        from: "images",
                        localField: "preferences.headerImage",
                        foreignField: "_id",
                        as: "preferences.headerImage",
                    },
                },
                {
                    $addFields: {
                        "preferences.headerImage": {
                            $cond: {
                                if: { $isArray: "$preferences.headerImage" },
                                then: { $arrayElemAt: ["$preferences.headerImage", 0] },
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

export const summary = [
    protectedRouteJWT,
    validators.param.userId,
    checkRequestValidationError,
    async (req: Request, res: Response) => {
        const { userId } = req.params;

        const aggregationResult = await User.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(`${userId}`) } },
            {
                $project: {
                    accountTag: 1,
                    githubId: 1,
                    followingCount: { $size: "$following.users" },
                    followersCount: { $size: "$followers.users" },
                    postCount: { $size: "$posts" },
                    likesCount: { $size: "$likes" },
                    preferences: {
                        displayName: "$preferences.displayName",
                        bio: "$preferences.bio",
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
                        // project headerImage even if it is not present in the document
                        headerImage: {
                            $cond: {
                                if: {
                                    $eq: [{ $type: "$preferences.headerImage" }, "missing"],
                                },
                                then: null,
                                else: "$preferences.headerImage",
                            },
                        },
                    },
                    isFollowing: {
                        $in: [
                            new mongoose.Types.ObjectId(`${res.locals.user.id}`),
                            "$followers.users",
                        ],
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
                            then: { $arrayElemAt: ["$preferences.profileImage", 0] },
                            else: null,
                        },
                    },
                },
            },
            // find headerImage if possible
            {
                $lookup: {
                    from: "images",
                    localField: "preferences.headerImage",
                    foreignField: "_id",
                    as: "preferences.headerImage",
                },
            },
            {
                $addFields: {
                    "preferences.headerImage": {
                        $cond: {
                            if: { $isArray: "$preferences.headerImage" },
                            then: { $arrayElemAt: ["$preferences.headerImage", 0] },
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
        // match user
        aggregation.push({ $match: { _id: new mongoose.Types.ObjectId(userId) } });
        // if 'after' query parameter is specified, check post is within 'posts' array
        if (after) {
            aggregation.push({
                $match: { posts: new mongoose.Types.ObjectId(`${after}`) },
            });
        }
        // unwind & populate posts
        aggregation.push(
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
            } else {
                // and filter posts based on their creation date being after the 'after' post
                aggregation.push({
                    $addFields: {
                        populatedPosts: {
                            $filter: {
                                input: "$populatedPosts",
                                cond: {
                                    $lt: ["$$this.createdAt", afterPost.createdAt],
                                },
                            },
                        },
                    },
                });
            }
        }
        // if 'repliesOnly' query parameter is specified as 'true', filter out non-replies
        if (repliesOnly === "true") {
            aggregation.push({
                $addFields: {
                    populatedPosts: {
                        $filter: {
                            input: "$populatedPosts",
                            as: "post",
                            cond: {
                                $or: [
                                    {
                                        $and: [
                                            { $ne: ["$$post.replyingTo", null] },
                                            { $eq: [{ $type: "$$post.replyingTo" }, "objectId"] },
                                        ],
                                    },
                                    { $eq: ["$populatedPosts", []] },
                                ],
                            },
                        },
                    },
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
        // match user
        aggregation.push({ $match: { _id: new mongoose.Types.ObjectId(userId) } });
        // if 'after' query parameter is specified, check like is within 'likes' array
        if (after) {
            aggregation.push({
                $match: { likes: new mongoose.Types.ObjectId(`${after}`) },
            });
        }
        // unwind & populate likes
        aggregation.push(
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
                // and filter likes based on their creation date being after the 'after' post
                aggregation.push({
                    $addFields: {
                        populatedLikes: {
                            $filter: {
                                input: "$populatedLikes",
                                cond: {
                                    $lt: ["$$this.createdAt", afterPost.createdAt],
                                },
                            },
                        },
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
                            then: { $arrayElemAt: ["$preferences.profileImage", 0] },
                            else: null,
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    accountTag: 1,
                    preferences: {
                        displayName: "$preferences.displayName",
                        profileImage: "$preferences.profileImage",
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

export const followers = [
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
        // match user
        aggregation.push({ $match: { _id: new mongoose.Types.ObjectId(userId) } });
        // if 'after' query parameter is specified, check user is within 'followers.users' array
        if (after) {
            aggregation.push({
                $match: { "followers.users": new mongoose.Types.ObjectId(`${after}`) },
            });
        }
        // unwind & populate followers.users
        aggregation.push(
            { $unwind: { path: "$followers.users", preserveNullAndEmptyArrays: true } },
            // if the 'followers.users' array is empty, it will not be present on the document at this stage
            {
                $addFields: {
                    userFollowers: {
                        $cond: {
                            if: { $eq: [{ $type: "$followers.users" }, "missing"] },
                            then: [],
                            else: "$followers.users",
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userFollowers",
                    foreignField: "_id",
                    as: "populatedFollowers",
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
                // and filter users based on their creation date being after the 'after' user
                aggregation.push({
                    $addFields: {
                        populatedFollowers: {
                            $filter: {
                                input: "$populatedFollowers",
                                cond: {
                                    $lt: ["$$this.createdAt", afterUser.createdAt],
                                },
                            },
                        },
                    },
                });
            }
        }
        if (!responding) {
            // sort & limit users
            aggregation.push({ $sort: { "populatedFollowers.createdAt": -1 } });
            if (limit) aggregation.push({ $limit: Number(limit) });
            // group results back into userFollowers array
            aggregation.push(
                { $unwind: { path: "$populatedFollowers", preserveNullAndEmptyArrays: true } },
                {
                    $group: {
                        _id: "$_id",
                        userFollowers: { $push: "$populatedFollowers" },
                    },
                },
            );
            // final projection
            aggregation.push({ $project: { _id: 0, userFollowers: "$userFollowers._id" } });
            // execute aggregation
            const aggregationResult = await User.aggregate(aggregation).exec();
            if (aggregationResult.length === 0) {
                sendResponse(res, 404, "Could not find followers");
            } else {
                const { userFollowers } = aggregationResult[0];
                await generateToken(res.locals.user)
                    .then((token) => {
                        sendResponse(res, 200, "Followers found", {
                            token,
                            followers: userFollowers,
                        });
                    })
                    .catch((tokenErr) => {
                        sendResponse(
                            res,
                            500,
                            tokenErr.message || `Followers found, but token creation failed`,
                            { followers: userFollowers },
                            tokenErr,
                        );
                    });
            }
        }
    }),
];

export const following = [
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
        // match user
        aggregation.push({ $match: { _id: new mongoose.Types.ObjectId(userId) } });
        // if 'after' query parameter is specified, check user is within 'following.users' array
        if (after) {
            aggregation.push({
                $match: { "following.users": new mongoose.Types.ObjectId(`${after}`) },
            });
        }
        // unwind & populate following.users
        aggregation.push(
            { $unwind: { path: "$following.users", preserveNullAndEmptyArrays: true } },
            // if the 'following.users' array is empty, it will not be present on the document at this stage
            {
                $addFields: {
                    userFollowing: {
                        $cond: {
                            if: { $eq: [{ $type: "$following.users" }, "missing"] },
                            then: [],
                            else: "$following.users",
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userFollowing",
                    foreignField: "_id",
                    as: "populatedFollowing",
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
                // if so, check user is within following.users array
                aggregation.push({
                    $addFields: {
                        populatedFollowing: {
                            $filter: {
                                input: "$populatedFollowing",
                                cond: {
                                    $lt: ["$$this.createdAt", afterUser.createdAt],
                                },
                            },
                        },
                    },
                });
            }
        }
        if (!responding) {
            // sort & limit users
            aggregation.push({ $sort: { "populatedFollowing.createdAt": -1 } });
            if (limit) aggregation.push({ $limit: Number(limit) });
            // group results back into userFollowing array
            aggregation.push(
                { $unwind: { path: "$populatedFollowing", preserveNullAndEmptyArrays: true } },
                {
                    $group: {
                        _id: "$_id",
                        userFollowing: { $push: "$populatedFollowing" },
                    },
                },
            );
            // final projection
            aggregation.push({ $project: { _id: 0, userFollowing: "$userFollowing._id" } });
            // execute aggregation
            const aggregationResult = await User.aggregate(aggregation).exec();
            if (aggregationResult.length === 0) {
                sendResponse(res, 404, "Could not find users following");
            } else {
                const { userFollowing } = aggregationResult[0];
                await generateToken(res.locals.user)
                    .then((token) => {
                        sendResponse(res, 200, "Users following found", {
                            token,
                            following: userFollowing,
                        });
                    })
                    .catch((tokenErr) => {
                        sendResponse(
                            res,
                            500,
                            tokenErr.message || `Users following found, but token creation failed`,
                            { following: userFollowing },
                            tokenErr,
                        );
                    });
            }
        }
    }),
];

export const chats = [
    protectedRouteJWT,
    validators.param.userId,
    validators.query.limit,
    validators.query.after,
    checkRequestValidationError,
    asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;
        const { limit, after } = req.query;

        if (userId !== res.locals.user.id) {
            sendResponse(res, 403, "Cannot view another user's chat list");
            return;
        }

        /// create aggregation pipeline
        const aggregation: mongoose.PipelineStage[] = [];
        // match user, unwind & populate chats
        aggregation.push({ $match: { _id: new mongoose.Types.ObjectId(userId) } });
        // if 'after' query parameter is specified, check chat is within 'chats' array
        if (after) {
            aggregation.push({
                $match: { chats: new mongoose.Types.ObjectId(`${after}`) },
            });
        }
        // unwind & populate chats
        aggregation.push(
            { $unwind: { path: "$chats", preserveNullAndEmptyArrays: true } },
            // if the 'chats' array is empty, it will not be present on the document at this stage
            {
                $addFields: {
                    userChats: {
                        $cond: {
                            if: { $eq: [{ $type: "$chats" }, "missing"] },
                            then: [],
                            else: "$chats",
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "chats",
                    localField: "userChats",
                    foreignField: "_id",
                    as: "populatedChats",
                },
            },
        );
        // if 'after' query parameter is specified, check chat exists
        let responding = false;
        if (after) {
            const afterChat = await Chat.findById(after);
            if (!afterChat) {
                sendResponse(res, 404, "Specified 'after' chat not found in the database");
                responding = true;
            } else {
                // and filter chats based on their update date being after the 'after' chat
                aggregation.push({
                    $addFields: {
                        populatedChats: {
                            $filter: {
                                input: "$populatedChats",
                                cond: {
                                    $lt: ["$$this.updatedAt", afterChat.updatedAt],
                                },
                            },
                        },
                    },
                });
            }
        }
        if (!responding) {
            // sort & limit chats
            aggregation.push({ $sort: { "populatedChats.updatedAt": -1 } });
            if (limit) aggregation.push({ $limit: Number(limit) });
            // group results back into userChats array
            aggregation.push(
                { $unwind: { path: "$populatedChats", preserveNullAndEmptyArrays: true } },
                {
                    $group: {
                        _id: "$_id",
                        userChats: { $push: "$populatedChats" },
                    },
                },
            );
            // final projection
            aggregation.push({ $project: { _id: 0, userChats: "$userChats._id" } });
            // execute aggregation
            const aggregationResult = await User.aggregate(aggregation).exec();
            if (aggregationResult.length === 0) {
                sendResponse(res, 404, "Could not find chats");
            } else {
                const { userChats } = aggregationResult[0];
                await generateToken(res.locals.user)
                    .then((token) => {
                        sendResponse(res, 200, "Chats found", {
                            token,
                            chats: userChats,
                        });
                    })
                    .catch((tokenErr) => {
                        sendResponse(
                            res,
                            500,
                            tokenErr.message || `Chats found, but token creation failed`,
                            { chats: userChats },
                            tokenErr,
                        );
                    });
            }
        }
    }),
];

export const recommendedUsers = [
    protectedRouteJWT,
    validators.param.userId,
    validators.query.limit,
    checkRequestValidationError,
    asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;
        const { limit } = req.query;

        if (userId !== res.locals.user.id) {
            sendResponse(res, 403, "Cannot view another user's recommendations");
            return;
        }

        /// create aggregation pipeline
        const aggregation: mongoose.PipelineStage[] = [];
        // match user
        aggregation.push({ $match: { _id: new mongoose.Types.ObjectId(userId) } });
        // populate users
        aggregation.push({
            $lookup: {
                from: "users",
                localField: "following.users",
                foreignField: "_id",
                as: "populatedUsers",
            },
        });
        // populate users for every user and add those documents to root
        aggregation.push({
            $group: {
                _id: "$_id",
                otherFields: { $first: "$$ROOT" },
                allUsers: { $push: "$populatedUsers.following.users" },
            },
        });
        // Unwind users and flatten them into a single array
        aggregation.push({ $unwind: "$allUsers" });
        aggregation.push({
            $addFields: {
                users: {
                    $reduce: {
                        input: "$allUsers",
                        initialValue: [],
                        in: { $concatArrays: ["$$value", "$$this"] },
                    },
                },
            },
        });
        // Filter out the active user and any users being followed by the active user
        aggregation.push({
            $addFields: {
                users: {
                    $filter: {
                        input: "$users",
                        cond: {
                            $and: [
                                { $ne: ["$$this", new mongoose.Types.ObjectId(userId)] },
                                { $not: { $in: ["$$this", "$otherFields.following.users"] } },
                            ],
                        },
                    },
                },
            },
        });
        // Unwind and group the 'users' array, counting how many times each user is present
        aggregation.push({ $unwind: { path: "$users", preserveNullAndEmptyArrays: true } });
        aggregation.push({
            $group: {
                _id: "$users",
                count: { $sum: 1 },
            },
        });
        // Sort and limit users
        aggregation.push({ $sort: { count: -1 } });
        if (limit) aggregation.push({ $limit: Number(limit) });
        // Group result to a new field
        aggregation.push({
            $group: {
                _id: null,
                topUsers: { $push: "$_id" },
            },
        });
        // execute aggregation
        const aggregationResult = await User.aggregate(aggregation);
        if (aggregationResult.length === 0) {
            sendResponse(res, 404, "Could not find recommended users");
        } else {
            let { topUsers } = aggregationResult[0];
            // when no results are found, the topUsers array will contain one entry: 'null', so
            // return an empty array instead
            if (!topUsers[0]) topUsers = [];
            await generateToken(res.locals.user)
                .then((token) => {
                    sendResponse(res, 200, "Recommended users found", {
                        token,
                        recommendedUsers: topUsers,
                    });
                })
                .catch((tokenErr) => {
                    sendResponse(
                        res,
                        500,
                        tokenErr.message || `Recommended users found, but token creation failed`,
                        { recommendedUsers: topUsers },
                        tokenErr,
                    );
                });
        }
    }),
];

export const chatActivity = [
    protectedRouteJWT,
    validators.param.userId,
    validators.query.limit,
    checkRequestValidationError,
    asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;
        const { limit } = req.query;

        if (userId !== res.locals.user.id) {
            sendResponse(res, 403, "Cannot view another user's recent chat activity");
            return;
        }

        /// create aggregation pipeline
        const aggregation: mongoose.PipelineStage[] = [];
        // match user, unwind & populate chats
        aggregation.push(
            { $match: { _id: new mongoose.Types.ObjectId(userId) } },
            {
                $addFields: {
                    userChats: {
                        $cond: {
                            if: { $eq: [{ $type: "$chats" }, "missing"] },
                            then: [],
                            else: "$chats",
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "chats",
                    localField: "userChats",
                    foreignField: "_id",
                    as: "populatedChats",
                },
            },
        );
        // populate chats' 'messages' array
        aggregation.push(
            {
                $unwind: {
                    path: "$populatedChats",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "messages",
                    localField: "populatedChats.messages",
                    foreignField: "_id",
                    as: "populatedChats.messages",
                },
            },
            {
                $group: {
                    _id: "$_id",
                    populatedChats: { $push: "$populatedChats" },
                },
            },
        );
        // filter messages
        aggregation.push({
            $addFields: {
                populatedChats: {
                    $map: {
                        input: "$populatedChats",
                        as: "chat",
                        in: {
                            $mergeObjects: [
                                "$$chat",
                                {
                                    filteredMessages: {
                                        $filter: {
                                            input: "$$chat.messages",
                                            as: "message",
                                            cond: {
                                                $and: [
                                                    { $eq: ["$$message.deleted", false] },
                                                    {
                                                        $ne: [
                                                            "$$message.author",
                                                            new mongoose.Types.ObjectId(userId),
                                                        ],
                                                    },
                                                    {
                                                        $gte: [
                                                            "$$message.createdAt",
                                                            { $subtract: [new Date(), 604800000] },
                                                        ],
                                                    },
                                                ],
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                    },
                },
            },
        });
        // remove chats with no messages that satisfy conditions
        aggregation.push({
            $addFields: {
                populatedChats: {
                    $filter: {
                        input: "$populatedChats",
                        as: "chat",
                        cond: {
                            $gt: [{ $size: "$$chat.filteredMessages" }, 0],
                        },
                    },
                },
            },
        });
        // use only the most recent message for each chat
        aggregation.push({
            $addFields: {
                populatedChats: {
                    $map: {
                        input: "$populatedChats",
                        as: "chat",
                        in: {
                            $mergeObjects: [
                                "$$chat",
                                {
                                    recentMessage: {
                                        $arrayElemAt: ["$$chat.filteredMessages", 0],
                                    },
                                },
                            ],
                        },
                    },
                },
            },
        });
        // sort and limit chats
        aggregation.push({
            $project: {
                populatedChats: {
                    $sortArray: {
                        input: "$populatedChats",
                        sortBy: { "recentMessage.createdAt": -1 },
                    },
                },
            },
        });
        if (limit) {
            aggregation.push({
                $project: {
                    populatedChats: {
                        $slice: ["$populatedChats", Number(limit)],
                    },
                },
            });
        }
        // populate chats' 'image' field if possible
        aggregation.push(
            {
                $unwind: {
                    path: "$populatedChats",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "images",
                    localField: "populatedChats.image",
                    foreignField: "_id",
                    as: "populatedChats.image",
                },
            },
            {
                $addFields: {
                    "populatedChats.image": {
                        $cond: {
                            if: { $eq: [{ $size: "$populatedChats.image" }, 0] },
                            then: null,
                            else: { $arrayElemAt: ["$populatedChats.image", 0] },
                        },
                    },
                },
            },
            {
                $group: {
                    _id: "$_id",
                    populatedChats: { $push: "$populatedChats" },
                },
            },
        );
        // populate all participants.user documents (including their 'preferences.profileImage' field)
        aggregation.push(
            { $unwind: { path: "$populatedChats", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$populatedChats.participants", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "users",
                    localField: "populatedChats.participants.user",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "images",
                    localField: "userDetails.preferences.profileImage",
                    foreignField: "_id",
                    as: "userDetails.preferences.profileImage",
                },
            },
            {
                $addFields: {
                    "userDetails.preferences.profileImage": {
                        $cond: {
                            if: { $eq: [{ $size: "$userDetails.preferences.profileImage" }, 0] },
                            then: null,
                            else: { $arrayElemAt: ["$userDetails.preferences.profileImage", 0] },
                        },
                    },
                },
            },
            {
                $addFields: {
                    "populatedChats.participants.user": "$userDetails",
                },
            },
            {
                $group: {
                    _id: {
                        chatId: "$_id",
                        populatedChatId: "$populatedChats._id",
                    },
                    participants: { $push: "$populatedChats.participants" },
                    chatDetails: { $first: "$populatedChats" },
                },
            },
            {
                $group: {
                    _id: "$_id.chatId",
                    populatedChats: {
                        $push: {
                            _id: "$_id.populatedChatId",
                            createdBy: "$chatDetails.createdBy",
                            participants: "$participants",
                            name: "$chatDetails.name",
                            image: "$chatDetails.image",
                            recentMessage: "$chatDetails.recentMessage",
                            createdAt: "$chatDetails.createdAt",
                        },
                    },
                },
            },
        );
        // final projection
        aggregation.push({
            $project: {
                _id: 0,
                populatedChats: {
                    $map: {
                        input: "$populatedChats",
                        as: "chat",
                        in: {
                            _id: "$$chat._id",
                            createdBy: "$$chat.createdBy",
                            participants: {
                                $map: {
                                    input: "$$chat.participants",
                                    as: "participant",
                                    in: {
                                        user: {
                                            _id: "$$participant.user._id",
                                            accountTag: "$$participant.user.accountTag",
                                            preferences: {
                                                displayName:
                                                    "$$participant.user.preferences.displayName",
                                                profileImage:
                                                    "$$participant.user.preferences.profileImage",
                                            },
                                        },
                                        nickname: "$$participant.nickname",
                                        role: "$$participant.role",
                                        muted: "$$participant.muted",
                                    },
                                },
                            },
                            name: "$$chat.name",
                            image: "$$chat.image",
                            recentMessage: {
                                _id: "$$chat.recentMessage._id",
                                author: "$$chat.recentMessage.author",
                                text: {
                                    $cond: {
                                        if: "$$chat.recentMessage.deleted",
                                        then: "",
                                        else: "$$chat.recentMessage.text",
                                    },
                                },
                                imageCount: {
                                    $cond: {
                                        if: {
                                            $or: [
                                                {
                                                    $eq: [
                                                        { $type: "$$chat.recentMessage.image" },
                                                        "missing",
                                                    ],
                                                },
                                                "$$chat.recentMessage.deleted",
                                            ],
                                        },
                                        then: 0,
                                        else: { $size: "$$chat.recentMessage.images" },
                                    },
                                },
                                deleted: "$$chat.recentMessage.deleted",
                                createdAt: "$$chat.recentMessage.createdAt",
                            },
                            createdAt: "$$chat.createdAt",
                        },
                    },
                },
            },
        });
        // sort chats again (for some reason they fall out of order sometimes)
        aggregation.push({
            $project: {
                populatedChats: {
                    $sortArray: {
                        input: "$populatedChats",
                        sortBy: { "recentMessage.createdAt": -1 },
                    },
                },
            },
        });
        /*
         * if there has not been a valid chat found in the pipeline, due to the way the pipeline
         * works there will have been a single object added to the 'populatedChats' array with some
         * of a typical chat document's fields present within it. To correctly respond with an empty
         * array of recent chat activity, we can easily filter out this 'template' object using one
         * of the fields that aren't present on it: '_id'
         */
        aggregation.push({
            $addFields: {
                populatedChats: {
                    $filter: {
                        input: "$populatedChats",
                        as: "chat",
                        cond: {
                            $and: [
                                { $ne: ["$$chat._id", null] },
                                { $ne: [{ $type: "$$chat._id" }, "missing"] },
                            ],
                        },
                    },
                },
            },
        });
        // execute aggregation
        const aggregationResult = await User.aggregate(aggregation).exec();
        if (aggregationResult.length === 0) {
            sendResponse(res, 404, "Could not find chat activity");
        } else {
            const result = aggregationResult[0].populatedChats;
            await generateToken(res.locals.user)
                .then((token) => {
                    sendResponse(res, 200, "Chat activity found", {
                        token,
                        chatActivity: result,
                    });
                })
                .catch((tokenErr) => {
                    sendResponse(
                        res,
                        500,
                        tokenErr.message || `Chat activity found, but token creation failed`,
                        { chatActivity: result },
                        tokenErr,
                    );
                });
        }
    }),
];

export const recommendedPosts = [
    protectedRouteJWT,
    validators.param.userId,
    validators.query.excludeActiveUser,
    validators.query.limit,
    validators.query.after,
    checkRequestValidationError,
    asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;
        const { limit, after, excludeActiveUser } = req.query;

        /// create aggregation pipeline
        const aggregation: mongoose.PipelineStage[] = [];
        // match user
        aggregation.push({ $match: { _id: new mongoose.Types.ObjectId(userId) } });
        // create new array field containing active user's _id and elements in following.users array
        aggregation.push({
            $addFields: {
                concatenatedUsers: !excludeActiveUser
                    ? { $concatArrays: [["$_id"], "$following.users"] }
                    : "$following.users",
            },
        });
        // populate users
        aggregation.push({
            $lookup: {
                from: "users",
                localField: "concatenatedUsers",
                foreignField: "_id",
                as: "populatedUsers",
            },
        });
        // populate posts for every user and add those documents to root
        aggregation.push({
            $group: {
                _id: "$_id",
                otherFields: { $first: "$$ROOT" },
                posts: { $push: "$populatedUsers.posts" },
            },
        });
        // Unwind posts and flatten them into a single array
        aggregation.push({ $unwind: "$posts" });
        aggregation.push({
            $addFields: {
                posts: {
                    $reduce: {
                        input: "$posts",
                        initialValue: [],
                        in: { $concatArrays: ["$$value", "$$this"] },
                    },
                },
            },
        });
        // if 'after' query parameter is specified, check post is within 'posts' array
        if (after) aggregation.push({ $match: { posts: new mongoose.Types.ObjectId(`${after}`) } });
        // populate posts
        aggregation.push({
            $lookup: {
                from: "posts",
                localField: "posts",
                foreignField: "_id",
                as: "populatedPosts",
            },
        });
        // if 'after' query parameter is specified, check post exists
        let responding = false;
        if (after) {
            const afterPost = await Post.findById(after);
            if (!afterPost) {
                sendResponse(res, 404, "Specified 'after' post not found in the database");
                responding = true;
            } else {
                // and filter posts based on their creation date being after the 'after' post
                aggregation.push({
                    $addFields: {
                        populatedPosts: {
                            $filter: {
                                input: "$populatedPosts",
                                cond: {
                                    $lt: ["$$this.createdAt", afterPost.createdAt],
                                },
                            },
                        },
                    },
                });
            }
        }
        if (!responding) {
            // sort and limit posts
            aggregation.push({
                $project: {
                    populatedPosts: {
                        $sortArray: {
                            input: "$populatedPosts",
                            sortBy: { createdAt: -1 },
                        },
                    },
                },
            });
            if (limit) {
                aggregation.push({
                    $project: {
                        populatedPosts: {
                            $slice: ["$populatedPosts", Number(limit)],
                        },
                    },
                });
            }
            // execute aggregation
            const aggregationResult = await User.aggregate(aggregation).exec();
            if (aggregationResult.length === 0) {
                sendResponse(res, 404, "Could not find posts");
            } else {
                const recPosts = aggregationResult[0].populatedPosts;
                await generateToken(res.locals.user)
                    .then((token) => {
                        sendResponse(res, 200, "Posts found", { token, posts: recPosts });
                    })
                    .catch((tokenErr) => {
                        sendResponse(
                            res,
                            500,
                            tokenErr.message || `Posts found, but token creation failed`,
                            { posts: recPosts },
                            tokenErr,
                        );
                    });
            }
        }
    }),
];
