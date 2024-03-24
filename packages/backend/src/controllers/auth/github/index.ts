import { Request, Response } from "express";
import mongoose from "mongoose";
import sendResponse from "@/utils/sendResponse";
import generateToken from "@/utils/generateToken";
import User from "@/models/user";
import * as types from "@/utils/types";

export const get = (req: Request, res: Response) => {
    const { GITHUB_CLIENT_ID, GITHUB_CALLBACK_URI } = process.env;
    const authParams = new URLSearchParams({
        client_id: GITHUB_CLIENT_ID || "",
        redirect_uri: GITHUB_CALLBACK_URI || "",
        scope: "user:email",
    });
    res.redirect(`https://github.com/login/oauth/authorize?${authParams}`);
};

// eslint-disable-next-line consistent-return
export const login = async (req: Request, res: Response) => {
    try {
        const { code } = req.query;

        if (!code) {
            return sendResponse(res, 400, "Access token not provided in query parameters");
        }

        const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;
        const authParams = new URLSearchParams({
            client_id: GITHUB_CLIENT_ID || "",
            client_secret: GITHUB_CLIENT_SECRET || "",
            scope: "user:email",
            code: code as string,
        });

        const authResponse = await fetch(
            `https://github.com/login/oauth/access_token?${authParams}`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
            },
        );

        if (!authResponse.ok) {
            return sendResponse(res, authResponse.status, authResponse.statusText);
        }

        const authData = await authResponse.json();
        const accessToken = authData.access_token;

        const userResponse = await fetch(`https://api.github.com/user`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!userResponse.ok) {
            return sendResponse(res, userResponse.status, userResponse.statusText);
        }

        const user = await userResponse.json();

        let existingUser = await User.findOne({ githubId: user.id });

        if (!existingUser) {
            existingUser = await new User({
                accountTag: new mongoose.Types.ObjectId(),
                githubId: user.id,
            }).save();
        }

        const token = await generateToken({ githubId: existingUser.githubId || "" });

        sendResponse(res, 200, "Successful login with GitHub", { token });
    } catch (err: unknown) {
        const status =
            err && typeof err === "object" && "status" in err ? (err.status as number) : 500;
        const message =
            err && typeof err === "object" && "message" in err
                ? (err.message as string)
                : "Internal Server Error";
        const error = err instanceof Error ? (err as types.ResponseError) : null;
        sendResponse(res, status, message, null, error);
    }
};
