import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import saveTokenFromAPIResponse from "@/utils/saveTokenFromAPIResponse";
import * as extendedTypes from "@shared/utils/extendedTypes";

export type Body = {
    participants: extendedTypes.MongooseObjectId[];
};

export type Response = extendedTypes.MongooseObjectId | null;

const createChat: apiFunctionTypes.POST<null, Body, Response> = async (
    data,
    abortController = null,
) => {
    let body;
    if (data && data.body) body = data.body;

    let participants: extendedTypes.MongooseObjectId[] = [];
    if (body) {
        participants = body.participants;
    }

    const result = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/chat`, {
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
                data: responseJSON.data ? responseJSON.data.chatId : null,
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
