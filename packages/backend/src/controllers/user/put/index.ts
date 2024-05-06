import { Request, Response } from "express";
import mongoose from "mongoose";
import generateToken from "@/utils/generateToken";
import sendResponse from "@/utils/sendResponse";
import protectedRouteJWT from "@/utils/protectedRouteJWT";
import * as types from "@/utils/types";
import User from "@/models/user";
import checkRequestValidationError from "@/utils/checkRequestValidationError";
import validation from "@shared/validation";
import validators from "../validators";

export const follow = [
    protectedRouteJWT,
    validators.param.userId,
    checkRequestValidationError,
    async (req: Request, res: Response) => {
        const { userId } = req.params;
        const session = await mongoose.startSession();

        if (userId === res.locals.user.id) {
            sendResponse(res, 400, "Active user cannot follow themselves");
        } else {
            try {
                session.startTransaction();

                // add/remove active user's _id to/from target user's 'followers' array accordingly
                const updatedTargetUser = await User.updateOne({ _id: userId }, [
                    {
                        $set: {
                            "followers.users": {
                                $cond: [
                                    {
                                        $in: [
                                            new mongoose.Types.ObjectId(`${res.locals.user.id}`),
                                            "$followers.users",
                                        ],
                                    },
                                    {
                                        $filter: {
                                            input: "$followers.users",
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
                                            "$followers.users",
                                            [new mongoose.Types.ObjectId(`${res.locals.user.id}`)],
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                ]);
                if (!updatedTargetUser.acknowledged) {
                    const error = new Error(
                        `Could not follow/unfollow target user`,
                    ) as types.ResponseError;
                    error.status = 401;
                    throw error;
                }

                // add/remove target user's _id to/from active user's 'following' array accordingly
                const updatedActiveUser = await User.updateOne({ _id: res.locals.user.id }, [
                    {
                        $set: {
                            "following.users": {
                                $cond: [
                                    {
                                        $in: [
                                            new mongoose.Types.ObjectId(userId),
                                            "$following.users",
                                        ],
                                    },
                                    {
                                        $filter: {
                                            input: "$following.users",
                                            cond: {
                                                $ne: [
                                                    "$$this",
                                                    new mongoose.Types.ObjectId(userId),
                                                ],
                                            },
                                        },
                                    },
                                    {
                                        $concatArrays: [
                                            "$following.users",
                                            [new mongoose.Types.ObjectId(userId)],
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                ]);
                if (!updatedActiveUser.acknowledged) {
                    const error = new Error(`Could not update active user`) as types.ResponseError;
                    error.status = 401;
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
                    err && typeof err === "object" && "status" in err
                        ? (err.status as number)
                        : 500;
                const message =
                    err && typeof err === "object" && "message" in err
                        ? (err.message as string)
                        : "Internal Server Error";
                const error = err instanceof Error ? (err as types.ResponseError) : null;
                sendResponse(res, status, message, null, error);
            }
        }
    },
];

export const preferencesDisplayName = [
    protectedRouteJWT,
    validators.param.userId,
    validators.body.preferences.displayName,
    checkRequestValidationError,
    async (req: Request, res: Response) => {
        const { userId } = req.params;
        const { displayName } = req.body;

        if (userId === res.locals.user.id) {
            return sendResponse(res, 401, "User is not authorised to perform this action");
        }

        const updatedTargetUser = await User.updateOne({ _id: userId }, [
            { $set: { "preferences.displayName": displayName } },
        ]);
        if (!updatedTargetUser.acknowledged) {
            return sendResponse(res, 500, "Could not update user's display name");
        }

        // create token and send response
        const response = await generateToken(res.locals.user)
            .then((token) => {
                return sendResponse(res, 201, "Request successful", { token });
            })
            .catch((tokenErr) => {
                return sendResponse(
                    res,
                    500,
                    tokenErr.message || `Request successful, but token creation failed`,
                    null,
                    tokenErr,
                );
            });
        return response;
    },
];
