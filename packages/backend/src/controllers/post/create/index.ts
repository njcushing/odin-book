import { Request, Response } from "express";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import generateToken from "@/utils/generateToken";
import sendResponse from "@/utils/sendResponse";
import protectedRouteJWT from "@/utils/protectedRouteJWT";
import { multiple } from "@/utils/uploadImage";
import User from "@/models/user";
import Post from "@/models/post";
import Image from "@/models/image";
import * as types from "@/utils/types";
import { body } from "express-validator";
import checkRequestValidationError from "@/utils/checkRequestValidationError";
import validators from "../validators";

export const regular = [
    protectedRouteJWT,
    validators.body.text,
    validators.body.images,
    validators.body.replyingTo,
    body("text").custom((value, { req }) => {
        if (req.body.text.length === 0 && req.body.images.length === 0) {
            throw new Error(
                "Your post must not be empty; there must either be some text, or images.",
            );
        } else {
            return true;
        }
    }),
    checkRequestValidationError,
    asyncHandler(async (req: Request, res: Response) => {
        // find user
        const user = await User.findById(res.locals.user._id);
        if (!user) {
            sendResponse(res, 404, "User not found in database");
        } else {
            // attempt to upload all images
            const [uploadResult, uploadResponses] = await multiple(req.body.images);
            if (!uploadResult) {
                sendResponse(res, 500, "Could not upload images");
            } else {
                const session = await mongoose.startSession();
                try {
                    session.startTransaction();

                    // create images
                    const images = await Promise.all(
                        uploadResponses.map(async (url) => {
                            const image = new Image({ url });
                            await image
                                .save()
                                .then(async (result) => result)
                                .catch((saveErr) => {
                                    throw saveErr;
                                });
                            return image;
                        }),
                    )
                        .then((result) => result)
                        .catch((err) => {
                            throw err;
                        });

                    // create post
                    const post = new Post({
                        author: user._id,
                        text: req.body.text,
                        images: images.map((image) => image._id),
                        replyingTo: req.body.replyingTo ? req.body.replyingTo : null,
                    });
                    await post.save().catch((saveErr) => {
                        const error = new Error(saveErr);
                        throw error;
                    });

                    // add new post _id to user's 'posts' array field
                    const updatedUser = await User.updateOne(
                        { _id: user._id },
                        { $addToSet: { posts: post._id } },
                    );
                    if (!updatedUser.acknowledged) {
                        const error = new Error(
                            `Could not add post to user's posts.`,
                        ) as types.ResponseError;
                        error.status = 500;
                        throw error;
                    }

                    // add new post to 'replies' array of post being replied to (if applicable)
                    if (req.body.replyingTo) {
                        const updatedPost = await Post.updateOne(
                            { _id: req.body.replyingTo },
                            { $addToSet: { replies: post._id } },
                        );
                        if (!updatedPost.acknowledged) {
                            const error = new Error(
                                `Could not add post to existing post's replies.`,
                            ) as types.ResponseError;
                            error.status = 500;
                            throw error;
                        }
                    }

                    await session.commitTransaction();

                    session.endSession();

                    // create token and send response
                    await generateToken(res.locals.user)
                        .then((token) => {
                            sendResponse(res, 201, "Post created successfully", {
                                token,
                                post,
                            });
                        })
                        .catch((tokenErr) => {
                            sendResponse(
                                res,
                                500,
                                tokenErr.message ||
                                    `Post created successfully, but token creation failed`,
                                { post },
                                tokenErr,
                            );
                        });
                } catch (err: unknown) {
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
        }
    }),
];
