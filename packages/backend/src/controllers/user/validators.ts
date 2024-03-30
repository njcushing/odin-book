import { body, param, query } from "express-validator";
import validation from "@shared/validation";
import mongoose from "mongoose";

const validators = {
    body: {
        accountTag: body("accountTag")
            .trim()
            .custom((value) => {
                const valid = validation.user.accountTag(value, "front");
                if (!valid.status) {
                    throw new Error(valid.message);
                } else {
                    return true;
                }
            }),
        email: body("email")
            .trim()
            .custom((value) => {
                const valid = validation.user.email(value, "front");
                if (!valid.status) {
                    throw new Error(valid.message);
                } else {
                    return true;
                }
            })
            .normalizeEmail({ all_lowercase: true }),
        password: body("password")
            .trim()
            .custom((value) => {
                const valid = validation.user.password(value, "front");
                if (!valid.status) {
                    throw new Error(valid.message);
                } else {
                    return true;
                }
            }),
        confirmPassword: body("confirmPassword")
            .trim()
            .custom((value) => {
                const valid = validation.user.confirmPassword(value, "front");
                if (!valid.status) {
                    throw new Error(valid.message);
                } else {
                    return true;
                }
            })
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error("Passwords don't match");
                } else {
                    return true;
                }
            }),
    },
    param: {
        userId: param("userId")
            .trim()
            .custom((value) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    throw new Error(
                        "The provided post id in the route path is not a valid MongoDB ObjectId",
                    );
                } else {
                    return true;
                }
            }),
    },
    query: {
        accountTag: query("accountTag")
            .trim()
            .custom((value) => {
                const valid = validation.user.accountTag(value, "front");
                if (!valid.status) {
                    throw new Error(valid.message);
                } else {
                    return true;
                }
            }),
        limit: query("limit")
            .trim()
            .optional()
            .custom((value) => {
                if (Number.isNaN(Number(value))) {
                    throw new Error(
                        "The provided 'from' query parameter is not a valid numeric value",
                    );
                }
                const valToInt = Number(value);
                if (!Number.isInteger(valToInt)) {
                    throw new Error("The provided 'from' query parameter is not a valid integer");
                }
                if (valToInt < 0) {
                    throw new Error("The provided 'from' query parameter must not be negative");
                }
                return true;
            }),
        after: query("after")
            .trim()
            .optional()
            .custom((value) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    throw new Error(
                        "The provided 'after' query parameter is not a valid MongoDB ObjectId",
                    );
                } else {
                    return true;
                }
            }),
        repliesOnly: query("repliesOnly")
            .optional()
            .isBoolean()
            .withMessage("The provided 'repliesOnly' query parameter is not a valid boolean value"),
    },
};

export default validators;
