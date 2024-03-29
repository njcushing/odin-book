import { body } from "express-validator";
import validation from "@shared/validation";

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
                    const valid = validation.post.imageBase64(value, "front");
                    if (!valid.status) throw new Error(valid.message);
                }
                return true;
            }),
    },
};

export default validators;
