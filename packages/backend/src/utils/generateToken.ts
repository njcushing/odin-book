import jwt from "jsonwebtoken";

export type Params = {
    accountTag?: string;
    password?: string;
    githubId?: string;
    [key: string]: unknown;
};

const generateToken = async (fields: Params) => {
    const { accountTag, password, githubId } = fields;
    let include: object | null = null;
    if (githubId) include = { githubId };
    else if (accountTag && password) include = { accountTag, password };

    return new Promise((resolve, reject) => {
        try {
            if (!include) throw new Error("No credentials provided for token generation");
            jwt.sign(
                include,
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
