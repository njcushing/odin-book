import { body } from "express-validator";
import validation from "@shared/validation";

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
};

export default validators;
