import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { body } from "express-validator";
import User from "@/models/user";
import checkRequestValidationError from "@/utils/checkRequestValidationError";
import validateCredentialsFromToken from "@/utils/validateCredentialsFromToken";
import generateToken from "@/utils/generateToken";
import validation from "@shared/validation";
import sendResponse from "@/utils/sendResponse";

const validateFields = [
    body("accountTag")
        .trim()
        .custom((value) => {
            const valid = validation.user.accountTag(value, "front");
            if (!valid.status) {
                throw new Error(valid.message);
            } else {
                return true;
            }
        }),
    body("password")
        .trim()
        .custom((value) => {
            const valid = validation.user.password(value, "front");
            if (!valid.status) {
                throw new Error(valid.message);
            } else {
                return true;
            }
        }),
];

export const post = [
    ...validateFields,
    checkRequestValidationError,
    asyncHandler(async (req: Request, res: Response) => {
        const credentials = {
            accountTag: req.body.accountTag,
            password: req.body.password,
        };
        const [status, user, message] = await validateCredentialsFromToken(credentials);
        if (!status) sendResponse(res, 401, message || undefined);
        else if (!user) sendResponse(res, 401, "User not found from credentials in token");
        else {
            const token = await generateToken(credentials);
            sendResponse(res, 200, "Successful login with credentials", { token });
        }
    }),
];

export const asGuest = [
    async (req: Request, res: Response) => {
        const guestUser = await User.findOne({ accountTag: "guest" });
        if (!guestUser) return sendResponse(res, 404, "Guest account not found in database");
        const credentials = {
            accountTag: guestUser.accountTag,
            password: process.env.GUEST_PASSWORD,
        };
        const token = await generateToken(credentials);
        return sendResponse(res, 200, "Successful login with credentials", { token });
    },
];
