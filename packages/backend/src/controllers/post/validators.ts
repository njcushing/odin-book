import { body, param, query } from "express-validator";
import validation from "@shared/validation";
import mongoose from "mongoose";

const validators = {
    body: {
        replyingTo: param("replyingTo")
            .trim()
            .optional()
            .custom((value) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    throw new Error(
                        "The provided post id to reply to in the request body is not a valid MongoDB ObjectId",
                    );
                } else {
                    return true;
                }
            }),
        text: body("text")
            .trim()
            .custom((value) => {
                const valid = validation.post.text(value, "front");
                if (!valid.status) {
                    throw new Error(valid.message);
                } else {
                    return true;
                }
            }),
        images: body("images")
            .trim()
            .custom((value) => {
                for (let i = 0; i < value.length; i++) {
                    const valid = validation.post.imageBase64(value[i], "front");
                    if (!valid.status) throw new Error(valid.message);
                }
                return true;
            }),
    },
    param: {
        postId: param("postId")
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
    },
};

export default validators;
