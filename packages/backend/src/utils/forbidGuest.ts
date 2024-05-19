import { Request, Response, NextFunction } from "express";
import sendResponse from "./sendResponse.js";

const forbidGuest = (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.user.type === "guest") {
        return sendResponse(res, 403, `Cannot perform this action on a guest account`);
    }
    return next();
};

export default forbidGuest;
