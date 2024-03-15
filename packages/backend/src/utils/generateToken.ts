import jwt from "jsonwebtoken";
import * as Types from "./types";

const generateToken = async (fields: Types.Token) => {
    return new Promise((resolve, reject) => {
        try {
            jwt.sign(
                { ...fields },
                process.env.AUTH_SECRET_KEY as string,
                { expiresIn: "7d" },
                (err, token) => {
                    resolve(err ? null : `Bearer ${token}`);
                },
            );
        } catch (error) {
            reject(error);
        }
    });
};

export default generateToken;
