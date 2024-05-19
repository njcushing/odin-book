import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import saveTokenFromAPIResponse from "@/utils/saveTokenFromAPIResponse";
import convertArrayBufferToBase64 from "@/utils/convertArrayBufferToBase64";
import mongoose from "mongoose";

export type Params = {
    chatId: mongoose.Types.ObjectId | null | undefined;
};

export type Body = {
    image: ArrayBuffer;
};

export type Response = {
    _id: mongoose.Types.ObjectId;
    url: mongoose.Types.ObjectId;
    alt: string;
} | null;

const createChat: apiFunctionTypes.PUT<Params, Body, Response> = async (
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

    let image: string = "";
    if (body) {
        image = await convertArrayBufferToBase64(body.image);
    }

    const result = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/chat/${chatId}/image`, {
        signal: abortController ? abortController.signal : null,
        method: "PUT",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("odin-book-auth-token") || "",
        },
        body: JSON.stringify({ image }),
    })
        .then(async (response) => {
            const responseJSON = await response.json();
            saveTokenFromAPIResponse(responseJSON);

            return {
                status: responseJSON.status,
                message: responseJSON.message,
                data: responseJSON.data ? responseJSON.data.image : null,
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

export default createChat;
