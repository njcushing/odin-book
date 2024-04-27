import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import mongoose from "mongoose";
import saveTokenFromAPIResponse from "@/utils/saveTokenFromAPIResponse";

export type Params = {
    chatId: mongoose.Types.ObjectId | null | undefined;
    after: mongoose.Types.ObjectId | null | undefined;
};

export type Response =
    | {
          _id: mongoose.Types.ObjectId;
          author: mongoose.Types.ObjectId;
          imageCount: number;
          replyingTo: mongoose.Types.ObjectId | null;
          deleted: boolean;
          createdAt: string;
      }[]
    | null;

const getChatMessages: apiFunctionTypes.GET<Params, Response> = async (
    data,
    abortController = null,
) => {
    const { chatId, after } = data.params as Params;

    if (!chatId) {
        return {
            status: 400,
            message: "No chatId provided to route path",
            data: null,
        };
    }

    const queryObject = { limit: "10", after };
    const urlParams = new URLSearchParams();
    Object.entries(queryObject).forEach(([key, value]) => {
        if (value !== "" && value !== undefined && value !== null) {
            urlParams.append(key, `${value}`);
        }
    });

    const result = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/chat/${chatId}/messages?${urlParams}`,
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
                data: responseJSON.data.messages,
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

export default getChatMessages;
