import jwt from "jsonwebtoken";

export type Params = {
    accountTag?: string;
    password?: string;
    githubId?: string;
};

const generateToken = async (fields: Params) => {
    return new Promise((resolve, reject) => {
        try {
            jwt.sign(
                { ...fields },
                process.env.AUTH_CLIENT_SECRET as string,
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
