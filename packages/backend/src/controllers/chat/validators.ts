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
                        "The provided message id to reply to in the request body is not a valid MongoDB ObjectId",
                    );
                } else {
                    return true;
                }
            }),
        name: body("name")
            .trim()
            .custom((value) => {
                const valid = validation.chat.name(value, "front");
                if (!valid.status) {
                    throw new Error(valid.message);
                } else {
                    return true;
                }
            }),
        text: body("text") // message text
            .trim()
            .custom((value) => {
                const valid = validation.message.text(value, "front");
                if (!valid.status) {
                    throw new Error(valid.message);
                } else {
                    return true;
                }
            }),
        image: body("image") // chat image
            .trim()
            .custom((value) => {
                const valid = validation.chat.imageBase64(value, "front");
                if (!valid.status) {
                    throw new Error(valid.message);
                } else {
                    return true;
                }
            }),
        images: body("images") // message images
            .trim()
            .custom((value) => {
                for (let i = 0; i < value.length; i++) {
                    const valid = validation.message.imageBase64(value[i], "front");
                    if (!valid.status) throw new Error(valid.message);
                }
                return true;
            }),
        participants: body("participants")
            .trim()
            .custom((value) => {
                if (!Array.isArray(value)) {
                    throw new Error(
                        `The provided participants field in the request body is not an array`,
                    );
                }
                if (value.length === 0) {
                    throw new Error(
                        `The provided participants array in the request body must have at least one element`,
                    );
                }
                for (let i = 0; i < value.length; i++) {
                    if (!mongoose.Types.ObjectId.isValid(value[i])) {
                        throw new Error(
                            `The provided participant id '${value[i]}' in the request body is not a valid MongoDB ObjectId`,
                        );
                    }
                }
                return true;
            }),
    },
    param: {
        chatId: param("chatId")
            .trim()
            .custom((value) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    throw new Error(
                        "The provided chat id in the route path is not a valid MongoDB ObjectId",
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
