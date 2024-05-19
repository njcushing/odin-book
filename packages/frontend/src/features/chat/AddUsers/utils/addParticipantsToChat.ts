import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import mongoose from "mongoose";
import saveTokenFromAPIResponse from "@/utils/saveTokenFromAPIResponse";

export type Params = {
    chatId: mongoose.Types.ObjectId | null | undefined;
};

export type Body = {
    participants: mongoose.Types.ObjectId[];
};

export type Response = {
    user: {
        _id: mongoose.Types.ObjectId;
        accountTag: string;
        preferences: {
            displayName: string;
            profileImage: {
                _id: mongoose.Types.ObjectId;
                url: string;
                alt: string;
            } | null;
        };
    };
    nickname: string;
    role: "admin" | "moderator" | "guest";
    muted: boolean;
}[];

const addParticipantsToChat: apiFunctionTypes.PUT<Params, Body, Response> = async (
    data,
    abortController = null,
) => {
    const { chatId } = data.params as Params;

    if (!chatId) {
        return {
            status: 400,
            message: "No chatId provided to route path",
            data: null,
        };
    }

    let body;
    if (data && data.body) body = data.body;

    let participants: mongoose.Types.ObjectId[] = [];
    if (body) {
        participants = body.participants;
    }

    const result = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/chat/${chatId}/participants`,
        {
            signal: abortController ? abortController.signal : null,
            method: "PUT",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("odin-book-auth-token") || "",
            },
            body: JSON.stringify({ participants }),
        },
    )
        .then(async (response) => {
            const responseJSON = await response.json();
            saveTokenFromAPIResponse(responseJSON);

            return {
                status: responseJSON.status,
                message: responseJSON.message,
                data: responseJSON.data ? responseJSON.data.participants : null,
            };
        })
        .catch((error) => {
            return {
                status: error.status ? error.status : 500,
                message: error.message,
                data: null,
            };
        });
    return result;
};

export default addParticipantsToChat;
