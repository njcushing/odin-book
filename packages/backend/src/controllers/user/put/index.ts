import { Request, Response } from "express";
import mongoose from "mongoose";
import generateToken from "@/utils/generateToken";
import sendResponse from "@/utils/sendResponse";
import protectedRouteJWT from "@/utils/protectedRouteJWT";
import forbidGuest from "@/utils/forbidGuest";
import * as types from "@/utils/types";
import User from "@/models/user";
import Image from "@/models/image";
import checkRequestValidationError from "@/utils/checkRequestValidationError";
import { single, destroy } from "@/utils/uploadImage";
import validators from "../validators";

export const follow = [
    protectedRouteJWT,
    forbidGuest,
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
                    error.status = 500;
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
    forbidGuest,
    validators.param.userId,
    validators.body.preferences.displayName,
    checkRequestValidationError,
    async (req: Request, res: Response) => {
        const { userId } = req.params;
        const { displayName } = req.body;

        if (userId !== res.locals.user.id) {
            return sendResponse(res, 403, "User is not authorised to perform this action");
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
                return sendResponse(res, 201, "Request successful", { token, displayName });
            })
            .catch((tokenErr) => {
                return sendResponse(
                    res,
                    500,
                    tokenErr.message || `Request successful, but token creation failed`,
                    { displayName },
                    tokenErr,
                );
            });
        return response;
    },
];

export const preferencesBio = [
    protectedRouteJWT,
    forbidGuest,
    validators.param.userId,
    validators.body.preferences.bio,
    checkRequestValidationError,
    async (req: Request, res: Response) => {
        const { userId } = req.params;
        const { bio } = req.body;

        if (userId !== res.locals.user.id) {
            return sendResponse(res, 403, "User is not authorised to perform this action");
        }

        const updatedTargetUser = await User.updateOne({ _id: userId }, [
            { $set: { "preferences.bio": bio } },
        ]);
        if (!updatedTargetUser.acknowledged) {
            return sendResponse(res, 500, "Could not update user's bio");
        }

        // create token and send response
        const response = await generateToken(res.locals.user)
            .then((token) => {
                return sendResponse(res, 201, "Request successful", { token, bio });
            })
            .catch((tokenErr) => {
                return sendResponse(
                    res,
                    500,
                    tokenErr.message || `Request successful, but token creation failed`,
                    { bio },
                    tokenErr,
                );
            });
        return response;
    },
];

export const preferencesProfileImage = [
    protectedRouteJWT,
    forbidGuest,
    validators.param.userId,
    validators.body.preferences.profileImage,
    checkRequestValidationError,
    async (req: Request, res: Response) => {
        const { userId } = req.params;
        const { profileImage } = req.body;

        if (userId !== res.locals.user.id) {
            return sendResponse(res, 403, "User is not authorised to perform this action");
        }

        const user = await User.findById(userId);
        if (!user) return sendResponse(res, 404, "Specified user not found in database");

        const existingImage = await Image.findById(user.preferences.profileImage);

        // attempt to upload image
        let failedUpload = false;
        const url = await single(profileImage)
            .then((result) => result)
            .catch((error) => {
                failedUpload = true;
                return error;
            });
        if (failedUpload) return sendResponse(res, 500, "Could not upload image");

        const session = await mongoose.startSession();

        // delete all created documents in case of aborted transaction
        session.on("abort", async () => {
            try {
                await Image.deleteMany({ session });
                await destroy(url); // destroy uploaded image too
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error("Error occurred while deleting documents:", error);
            }
        });

        try {
            session.startTransaction();

            // create image
            const imageDoc = new Image({ url });
            await imageDoc.save({ session }).catch((saveErr) => {
                const error = new Error(saveErr);
                throw error;
            });

            // update user's 'preferences.profileImage' field to new image _id
            const updatedChat = await User.updateOne({ _id: userId }, [
                { $set: { "preferences.profileImage": imageDoc._id } },
            ]);
            if (!updatedChat.acknowledged) {
                return sendResponse(res, 500, "Could not update user's profile image");
            }

            // attempt to destroy existing image (in two places: the database first, then the cloud)
            if (existingImage) {
                const deletedImage = await Image.deleteOne({ _id: existingImage._id });
                if (deletedImage.deletedCount === 0) {
                    const error = new Error(
                        `Could not delete current image: ${existingImage.url}.`,
                    ) as types.ResponseError;
                    error.status = 500;
                    throw error;
                }

                let failedDestroy = false;
                await destroy(existingImage.url)
                    .then((result) => result)
                    .catch((error) => {
                        failedDestroy = true;
                        return error;
                    });
                if (failedDestroy) {
                    const error = new Error(
                        `Could not destroy current image: ${existingImage.url}.`,
                    ) as types.ResponseError;
                    error.status = 500;
                    throw error;
                }
            }

            await session.commitTransaction();

            session.endSession();

            const responseImage = {
                _id: imageDoc._id,
                url: imageDoc.url,
                alt: imageDoc.alt,
            };

            // create token and send response
            const response = await generateToken(res.locals.user)
                .then((token) => {
                    return sendResponse(res, 200, "User's profile image successfully updated", {
                        token,
                        profileImage: responseImage,
                    });
                })
                .catch((tokenErr) => {
                    return sendResponse(
                        res,
                        500,
                        tokenErr.message ||
                            "User's profile image successfully updated, but token creation failed",
                        { profileImage: responseImage },
                        tokenErr,
                    );
                });
            return response;
        } catch (err: unknown) {
            await session.abortTransaction();

            session.endSession();

            const status =
                err && typeof err === "object" && "status" in err ? (err.status as number) : 500;
            const errMessage =
                err && typeof err === "object" && "message" in err
                    ? (err.message as string)
                    : "Internal Server Error";
            const error = err instanceof Error ? (err as types.ResponseError) : null;
            return sendResponse(res, status, errMessage, null, error);
        }
    },
];

export const preferencesHeaderImage = [
    protectedRouteJWT,
    forbidGuest,
    validators.param.userId,
    validators.body.preferences.headerImage,
    checkRequestValidationError,
    async (req: Request, res: Response) => {
        const { userId } = req.params;
        const { headerImage } = req.body;

        if (userId !== res.locals.user.id) {
            return sendResponse(res, 403, "User is not authorised to perform this action");
        }

        const user = await User.findById(userId);
        if (!user) return sendResponse(res, 404, "Specified user not found in database");

        const existingImage = await Image.findById(user.preferences.headerImage);

        // attempt to upload image
        let failedUpload = false;
        const url = await single(headerImage)
            .then((result) => result)
            .catch((error) => {
                failedUpload = true;
                return error;
            });
        if (failedUpload) return sendResponse(res, 500, "Could not upload image");

        const session = await mongoose.startSession();

        // delete all created documents in case of aborted transaction
        session.on("abort", async () => {
            try {
                await Image.deleteMany({ session });
                await destroy(url); // destroy uploaded image too
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error("Error occurred while deleting documents:", error);
            }
        });

        try {
            session.startTransaction();

            // create image
            const imageDoc = new Image({ url });
            await imageDoc.save({ session }).catch((saveErr) => {
                const error = new Error(saveErr);
                throw error;
            });

            // update user's 'preferences.headerImage' field to new image _id
            const updatedChat = await User.updateOne({ _id: userId }, [
                { $set: { "preferences.headerImage": imageDoc._id } },
            ]);
            if (!updatedChat.acknowledged) {
                return sendResponse(res, 500, "Could not update user's profile image");
            }

            // attempt to destroy existing image (in two places: the database first, then the cloud)
            if (existingImage) {
                const deletedImage = await Image.deleteOne({ _id: existingImage._id });
                if (deletedImage.deletedCount === 0) {
                    const error = new Error(
                        `Could not delete current image: ${existingImage.url}.`,
                    ) as types.ResponseError;
                    error.status = 500;
                    throw error;
                }

                let failedDestroy = false;
                await destroy(existingImage.url)
                    .then((result) => result)
                    .catch((error) => {
                        failedDestroy = true;
                        return error;
                    });
                if (failedDestroy) {
                    const error = new Error(
                        `Could not destroy current image: ${existingImage.url}.`,
                    ) as types.ResponseError;
                    error.status = 500;
                    throw error;
                }
            }

            await session.commitTransaction();

            session.endSession();

            const responseImage = {
                _id: imageDoc._id,
                url: imageDoc.url,
                alt: imageDoc.alt,
            };

            // create token and send response
            const response = await generateToken(res.locals.user)
                .then((token) => {
                    return sendResponse(res, 200, "User's header image successfully updated", {
                        token,
                        headerImage: responseImage,
                    });
                })
                .catch((tokenErr) => {
                    return sendResponse(
                        res,
                        500,
                        tokenErr.message ||
                            "User's header image successfully updated, but token creation failed",
                        { headerImage: responseImage },
                        tokenErr,
                    );
                });
            return response;
        } catch (err: unknown) {
            await session.abortTransaction();

            session.endSession();

            const status =
                err && typeof err === "object" && "status" in err ? (err.status as number) : 500;
            const errMessage =
                err && typeof err === "object" && "message" in err
                    ? (err.message as string)
                    : "Internal Server Error";
            const error = err instanceof Error ? (err as types.ResponseError) : null;
            return sendResponse(res, status, errMessage, null, error);
        }
    },
];

export const preferencesTheme = [
    protectedRouteJWT,
    forbidGuest,
    validators.param.userId,
    validators.body.preferences.theme,
    checkRequestValidationError,
    async (req: Request, res: Response) => {
        const { userId } = req.params;
        const { theme } = req.body;

        if (userId !== res.locals.user.id) {
            return sendResponse(res, 403, "User is not authorised to perform this action");
        }

        const updatedTargetUser = await User.updateOne({ _id: userId }, [
            { $set: { "preferences.theme": theme } },
        ]);
        if (!updatedTargetUser.acknowledged) {
            return sendResponse(res, 500, "Could not update user's theme");
        }

        // create token and send response
        const response = await generateToken(res.locals.user)
            .then((token) => {
                return sendResponse(res, 201, "Request successful", { token, theme });
            })
            .catch((tokenErr) => {
                return sendResponse(
                    res,
                    500,
                    tokenErr.message || `Request successful, but token creation failed`,
                    { theme },
                    tokenErr,
                );
            });
        return response;
    },
];
