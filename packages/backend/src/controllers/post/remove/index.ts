import { Request, Response } from "express";
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
    validators.query.id,
    checkRequestValidationError,
    asyncHandler(async (req: Request, res: Response) => {
        const { postId } = req.query;
        // find user
        const user = await User.findOne({ _id: res.locals.user._id, posts: postId });
        if (!user) {
            sendResponse(res, 404, "User not found in database");
        } else {
            // set post's 'deleted' field to 'true'
            const post = await Post.updateOne({ _id: postId }, { $set: { deleted: true } });
            if (!post.acknowledged) {
                sendResponse(res, 500, `Could not delete post: ${postId}.`);
            } else {
                await generateToken(res.locals.user)
                    .then((token) => {
                        sendResponse(res, 201, "Post deleted successfully", { token });
                    })
                    .catch((tokenErr) => {
                        sendResponse(
                            res,
                            500,
                            tokenErr.message ||
                                `Post deleted successfully, but token creation failed`,
                            null,
                            tokenErr,
                        );
                    });
            }
        }
    }),
];
