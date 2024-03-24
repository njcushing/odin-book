import { Request, Response } from "express";
import mongoose from "mongoose";
import protectedRouteJWT from "@/utils/protectedRouteJWT";
import sendResponse from "@/utils/sendResponse";
import generateToken from "@/utils/generateToken";
import * as types from "@/utils/types";
import User from "@/models/user";

export const active = [
    protectedRouteJWT,
    async (req: Request, res: Response) => {
        try {
            if (req.user && "id" in req.user && req.user.id) {
                const userId = new mongoose.Types.ObjectId(req.user.id as string);

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
                                            $eq: [
                                                { $type: "$preferences.profileImage" },
                                                "missing",
                                            ],
                                        },
                                        then: null,
                                        else: "$preferences.profileImage",
                                    },
                                },
                            },
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
                                                    $cond: [
                                                        { $ne: ["$$post.replyingTo", null] },
                                                        1,
                                                        0,
                                                    ],
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
                    const token = await generateToken({ ...req.user });
                    sendResponse(res, 200, "User found", { user, token });
                }
            } else {
                sendResponse(res, 400, "No valid user id provided in token payload");
            }
        } catch (err: unknown) {
            const status =
                err && typeof err === "object" && "status" in err ? (err.status as number) : 500;
            const message =
                err && typeof err === "object" && "message" in err
                    ? (err.message as string)
                    : "Internal Server Error";
            const error = err instanceof Error ? (err as types.ResponseError) : null;
            sendResponse(res, status, message, null, error);
        }
    },
];
