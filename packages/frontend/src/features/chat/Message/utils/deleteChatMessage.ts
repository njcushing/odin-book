import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import mongoose from "mongoose";
import saveTokenFromAPIResponse from "@/utils/saveTokenFromAPIResponse";

export type Params = {
    chatId: mongoose.Types.ObjectId | null | undefined;
    messageId: mongoose.Types.ObjectId | null | undefined;
};

export type Response = null;

const deleteChatMessage: apiFunctionTypes.DELETE<Params, Response> = async (
    data,
    abortController = null,
) => {
    const { chatId } = data.params as Params;
    const { messageId } = data.params as Params;

    if (!chatId) {
        return {
            status: 400,
            message: "No chatId provided to route path",
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
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/chat/${chatId}/message/${messageId}`,
        {
            signal: abortController ? abortController.signal : null,
            method: "DELETE",
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
                data: null,
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

export default deleteChatMessage;
