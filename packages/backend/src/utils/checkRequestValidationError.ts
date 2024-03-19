import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationError } from "express-validator";
import sendResponse from "./sendResponse.js";

const compileValidationErrors = (arr: ValidationError[]) => {
    const reducedErrorArray: string[] = [];
    arr.forEach((error) => reducedErrorArray.push(error.msg));
    return reducedErrorArray.join(", ");
};

const checkRequestValidationError = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorString = compileValidationErrors(errors.array());
        return sendResponse(
            res,
            400,
            `Cannot complete request due to invalid fields: ${errorString}`,
        );
    }
    return next();
};

export default checkRequestValidationError;
