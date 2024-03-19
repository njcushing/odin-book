import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import sendResponse from "@/utils/sendResponse";
import generateToken from "@/utils/generateToken";
import * as Types from "@/utils/types";
import passport from "passport";

export const get = [passport.authenticate("github", { session: false, scope: ["user:email"] })];

export const callback = [
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate(
            "github",
            { session: false },
            async (
                err: Types.ResponseError | null,
                user: { providers: { provider: string; providerId: string }[] } | null,
                info?: { message?: string },
            ) => {
                if (err) {
                    return sendResponse(
                        res,
                        err.status,
                        (info && info.message) || err.message,
                        null,
                        err,
                    );
                }
                if (user) {
                    const provider = user.providers.find((prov) => prov.providerId === "github");
                    const token = await generateToken({ providedBy: provider });
                    return sendResponse(res, 200, "Successful login with GitHub", { token });
                }
                return sendResponse(res, 500, "Something went wrong", null);
            },
        )(req, res, next);
    }),
];
