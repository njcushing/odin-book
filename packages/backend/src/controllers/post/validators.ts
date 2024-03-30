import { body, param } from "express-validator";
import validation from "@shared/validation";
import mongoose from "mongoose";

const validators = {
    body: {
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
};

export default validators;
