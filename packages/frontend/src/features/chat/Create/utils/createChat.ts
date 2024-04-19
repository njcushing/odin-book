import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import saveTokenFromAPIResponse from "@/utils/saveTokenFromAPIResponse";
import mongoose from "mongoose";

export type Body = {
    participants: mongoose.Types.ObjectId[];
};

export type Response = mongoose.Types.ObjectId | null;

const createChat: apiFunctionTypes.POST<null, Body, Response> = async (
    data,
    abortController = null,
) => {
    let body;
    if (data && data.body) body = data.body;

    let participants: mongoose.Types.ObjectId[] = [];
    if (body) {
        participants = body.participants;
    }

    const result = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/chat`, {
        signal: abortController ? abortController.signal : null,
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("odin-book-auth-token") || "",
        },
        body: JSON.stringify({ participants }),
    })
        .then(async (response) => {
            const responseJSON = await response.json();
            saveTokenFromAPIResponse(responseJSON);

            return {
                status: responseJSON.status,
                message: responseJSON.message,
                data: responseJSON.chatId,
            };
        })
        .catch((error) => {
            return {
                status: error.status ? error.status : 500,
                message: error.message,
                data: null,
            };
        });

    if (result.status === 401) window.location.href = "/";

    return result;
};

export default createChat;
