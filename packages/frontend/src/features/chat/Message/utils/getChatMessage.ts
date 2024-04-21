import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import mongoose from "mongoose";
import saveTokenFromAPIResponse from "@/utils/saveTokenFromAPIResponse";

export type Params = {
    chatId: mongoose.Types.ObjectId | null | undefined;
    messageId: mongoose.Types.ObjectId | null | undefined;
};

export type Response = {
    _id: mongoose.Types.ObjectId;
    author: {
        _id: mongoose.Types.ObjectId;
        preferences: {
            profileImage: {
                _id: mongoose.Types.ObjectId;
                url: string;
                alt: string;
            } | null;
        };
    };
    text: string;
    images: {
        _id: mongoose.Types.ObjectId;
        url: string;
        alt: string;
    }[];
    replyingTo: {
        _id: mongoose.Types.ObjectId;
        author: {
            _id: mongoose.Types.ObjectId;
            preferences: {
                profileImage: {
                    _id: mongoose.Types.ObjectId;
                    url: string;
                    alt: string;
                } | null;
            };
        };
        text: string;
        images: {
            _id: mongoose.Types.ObjectId;
            url: string;
            alt: string;
        }[];
        replyingTo: mongoose.Types.ObjectId | null;
        deleted: boolean;
        createdAt: string;
    };
    deleted: boolean;
    createdAt: string;
} | null;

const getChatMessage: apiFunctionTypes.GET<Params, Response> = async (
    data,
    abortController = null,
) => {
    const { chatId } = data.params as Params;
    const { messageId } = data.params as Params;

    if (!chatId) {
        return {
            status: 400,
            message: "No userId provided to route path",
            data: null,
        };
    }

    if (!messageId) {
        return {
            status: 400,
            message: "No messageId provided to route path",
            data: null,
        };
    }

    const result = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/chat/${chatId}/message/${messageId}`,
        {
            signal: abortController ? abortController.signal : null,
            method: "GET",
            mode: "cors",
            headers: {
                Authorization: localStorage.getItem("odin-book-auth-token") || "",
            },
        },
    )
        .then(async (response) => {
            const responseJSON = await response.json();
            saveTokenFromAPIResponse(responseJSON);

            return {
                status: responseJSON.status,
                message: responseJSON.message,
                data: responseJSON.data.message,
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

export default getChatMessage;
