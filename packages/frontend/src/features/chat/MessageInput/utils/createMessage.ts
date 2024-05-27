import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import saveTokenFromAPIResponse from "@/utils/saveTokenFromAPIResponse";
import convertArrayBufferToBase64 from "@/utils/convertArrayBufferToBase64";
import * as extendedTypes from "@shared/utils/extendedTypes";
import { Response as GetChatMessagesResponse } from "@/features/chat/MessageList/utils/getChatMessages";

export type Params = {
    chatId: extendedTypes.MongooseObjectId | null | undefined;
};

export type Body = {
    replyingTo: extendedTypes.MongooseObjectId | undefined | null;
    text: string;
    images: ArrayBuffer[];
};

export type Response = GetChatMessagesResponse;

const createMessage: apiFunctionTypes.POST<Params, Body, Response> = async (
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

    let text = "";
    let images: string[] = [];
    let replyingTo = "";
    if (body) {
        text = body.text;
        const promises = body.images.map(async (image) => {
            const base64 = await convertArrayBufferToBase64(image);
            return base64;
        });
        await Promise.all(promises).then((base64Images) => {
            images = base64Images;
        });
        replyingTo = body.replyingTo ? `${body.replyingTo}` : "";
    }

    const result = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/chat/${chatId}/message`, {
        signal: abortController ? abortController.signal : null,
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("odin-book-auth-token") || "",
        },
        body: JSON.stringify({ text, images, replyingTo }),
    })
        .then(async (response) => {
            const responseJSON = await response.json();
            saveTokenFromAPIResponse(responseJSON);

            return {
                status: responseJSON.status,
                message: responseJSON.message,
                data: responseJSON.data ? responseJSON.data.message : null,
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

export default createMessage;
