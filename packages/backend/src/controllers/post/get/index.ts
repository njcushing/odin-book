import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import generateToken from "@/utils/generateToken";
import sendResponse from "@/utils/sendResponse";
import protectedRouteJWT from "@/utils/protectedRouteJWT";
import Post from "@/models/post";
import checkRequestValidationError from "@/utils/checkRequestValidationError";
import validators from "../validators";

export const regular = [
    protectedRouteJWT,
    validators.param.id,
    checkRequestValidationError,
    asyncHandler(async (req: Request, res: Response) => {
        const { postId } = req.params;
        // find post
        const post = await Post.findOne({ _id: postId });
        if (!post) {
            sendResponse(res, 404, "Post not found in database");
        } else {
            await generateToken(res.locals.user)
                .then((token) => {
                    sendResponse(res, 200, "Post found", { token, post });
                })
                .catch((tokenErr) => {
                    sendResponse(
                        res,
                        500,
                        tokenErr.message || `Post found, but token creation failed`,
                        { post },
                        tokenErr,
                    );
                });
        }
    }),
];
