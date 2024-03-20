import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import checkRequestValidationError from "@/utils/checkRequestValidationError";
import bcrypt from "bcryptjs";
import generateToken from "@/utils/generateToken";
import sendResponse from "@/utils/sendResponse";
import User from "@/models/user";
import validators from "../validators";

export const post = [
    validators.body.accountTag,
    validators.body.email,
    validators.body.password,
    validators.body.confirmPassword,
    checkRequestValidationError,
    asyncHandler(async (req: Request, res: Response) => {
        bcrypt.hash(req.body.password, 10, async (hashErr, hashedPassword) => {
            if (hashErr) {
                sendResponse(res, 500, hashErr.message || "Something went wrong", null, {
                    ...hashErr,
                    status: 500,
                });
            } else {
                const newUser = new User({
                    accountTag: req.body.accountTag,
                    email: req.body.email,
                    password: hashedPassword,
                });
                await newUser
                    .save()
                    .then(async (user) => {
                        const credentials = {
                            accountTag: user.accountTag,
                            password: req.body.password,
                        };
                        await generateToken(credentials)
                            .then((token) => {
                                sendResponse(res, 201, "Account created successfully", { token });
                            })
                            .catch((tokenErr) => {
                                sendResponse(
                                    res,
                                    500,
                                    tokenErr.message ||
                                        `Account created successfully, but token creation failed`,
                                    null,
                                    tokenErr,
                                );
                            });
                    })
                    .catch((saveErr) => {
                        if (saveErr.code === 11000) {
                            let message = "Credential(s) is/are already in use.";
                            if (
                                Object.prototype.hasOwnProperty.call(saveErr.keyValue, "accountTag")
                            ) {
                                message = "This account tag is already in use.";
                            }
                            if (Object.prototype.hasOwnProperty.call(saveErr.keyValue, "email")) {
                                message = "This email is already registered with another account.";
                            }
                            sendResponse(res, 409, message, null, saveErr);
                        } else {
                            sendResponse(
                                res,
                                500,
                                saveErr.message || "User creation failed",
                                null,
                                saveErr,
                            );
                        }
                    });
            }
        });
    }),
];
