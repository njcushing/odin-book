import { Request, Response } from "express";
import mongoose from "mongoose";
import generateToken from "@/utils/generateToken";
import sendResponse from "@/utils/sendResponse";
import protectedRouteJWT from "@/utils/protectedRouteJWT";
import forbidGuest from "@/utils/forbidGuest";
import * as types from "@/utils/types";
import User from "@/models/user";
import Post from "@/models/post";
import checkRequestValidationError from "@/utils/checkRequestValidationError";
import validators from "../validators";

export const like = [
    protectedRouteJWT,
    forbidGuest,
    validators.param.postId,
    checkRequestValidationError,
    async (req: Request, res: Response) => {
        const { postId } = req.params;
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            // check if user _id is within post's 'likes' array; add/remove it accordingly
            const updatedPost = await Post.updateOne({ _id: postId }, [
                {
                    $set: {
                        likes: {
                            $cond: [
                                {
                                    $in: [
                                        new mongoose.Types.ObjectId(`${res.locals.user.id}`),
                                        "$likes",
                                    ],
                                },
                                {
                                    $filter: {
                                        input: "$likes",
                                        cond: {
                                            $ne: [
                                                "$$this",
                                                new mongoose.Types.ObjectId(
                                                    `${res.locals.user.id}`,
                                                ),
                                            ],
                                        },
                                    },
                                },
                                {
                                    $concatArrays: [
                                        "$likes",
                                        [new mongoose.Types.ObjectId(`${res.locals.user.id}`)],
                                    ],
                                },
                            ],
                        },
                    },
                },
            ]);
            if (!updatedPost.acknowledged) {
                const error = new Error(
                    `Could not like/remove like from post`,
                ) as types.ResponseError;
                error.status = 500;
                throw error;
            }

            // update user in the same way with the post's _id
            const updatedUser = await User.updateOne({ _id: res.locals.user.id }, [
                {
                    $set: {
                        likes: {
                            $cond: [
                                {
                                    $in: [new mongoose.Types.ObjectId(postId), "$likes"],
                                },
                                {
                                    $filter: {
                                        input: "$likes",
                                        cond: {
                                            $ne: ["$$this", new mongoose.Types.ObjectId(postId)],
                                        },
                                    },
                                },
                                {
                                    $concatArrays: [
                                        "$likes",
                                        [new mongoose.Types.ObjectId(postId)],
                                    ],
                                },
                            ],
                        },
                    },
                },
            ]);
            if (!updatedUser.acknowledged) {
                const error = new Error(
                    `Could not add/remove post to/from user's posts`,
                ) as types.ResponseError;
                error.status = 500;
                throw error;
            }

            await session.commitTransaction();
            session.endSession();

            // create token and send response
            await generateToken(res.locals.user)
                .then((token) => {
                    sendResponse(res, 201, "Request successful", {
                        token,
                    });
                })
                .catch((tokenErr) => {
                    sendResponse(
                        res,
                        500,
                        tokenErr.message || `Request successful, but token creation failed`,
                        null,
                        tokenErr,
                    );
                });
        } catch (err: unknown) {
            await session.abortTransaction();

            session.endSession();

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
