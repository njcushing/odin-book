import { Request, Response, NextFunction } from "express";
import passport from "passport";
import * as Types from "@/utils/types";
import sendResponse from "./sendResponse.js";

const protectedRouteJWT = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
        "jwt",
        { session: false },
        (err: Types.ResponseError, user?: object | null, info?: { message?: string }) => {
            if (err) {
                return next(
                    sendResponse(res, err.status, (info && info.message) || err.message, null, err),
                );
            }
            if (user) {
                res.locals.user = user;
                return next();
            }
            return next(sendResponse(res, 500, (info && info.message) || "Something went wrong"));
        },
    )(req, res, next);
};

export default protectedRouteJWT;
