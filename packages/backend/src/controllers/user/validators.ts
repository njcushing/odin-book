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
        preferences: {
            displayName: body("displayName")
                .trim()
                .custom((value) => {
                    const valid = validation.user.displayName(value, "front");
                    if (!valid.status) {
                        throw new Error(valid.message);
                    } else {
                        return true;
                    }
                }),
            bio: body("bio")
                .trim()
                .custom((value) => {
                    const valid = validation.user.bio(value, "front");
                    if (!valid.status) {
                        throw new Error(valid.message);
                    } else {
                        return true;
                    }
                }),
            profileImage: body("profileImage")
                .trim()
                .custom((value) => {
                    const valid = validation.user.imageBase64(value, "front");
                    if (!valid.status) {
                        throw new Error(valid.message);
                    } else {
                        return true;
                    }
                }),
            headerImage: body("headerImage")
                .trim()
                .custom((value) => {
                    const valid = validation.user.imageBase64(value, "front");
                    if (!valid.status) {
                        throw new Error(valid.message);
                    } else {
                        return true;
                    }
                }),
            theme: body("theme")
                .trim()
                .custom((value) => {
                    const valid = validation.user.theme(value, "front");
                    if (!valid.status) {
                        throw new Error(valid.message);
                    } else {
                        return true;
                    }
                }),
        },
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
            .custom((value) => {
                if (value !== "true" && value !== "false") {
                    throw new Error(
                        "The provided 'repliesOnly' query parameter is not a valid boolean value",
                    );
                } else {
                    return true;
                }
            }),
        softCheck: query("softCheck")
            .optional()
            .custom((value) => {
                if (value !== "true" && value !== "false") {
                    throw new Error(
                        "The provided 'softCheck' query parameter is not a valid boolean value",
                    );
                } else {
                    return true;
                }
            }),
        excludeActiveUser: query("excludeActiveUser")
            .optional()
            .custom((value) => {
                if (value !== "true" && value !== "false") {
                    throw new Error(
                        "The provided 'excludeActiveUser' query parameter is not a valid boolean value",
                    );
                } else {
                    return true;
                }
            }),
    },
};

export default validators;
