import { query } from "express-validator";
import mongoose from "mongoose";

const validators = {
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
