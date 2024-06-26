import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import * as extendedTypes from "@shared/utils/extendedTypes";
import saveTokenFromAPIResponse from "@/utils/saveTokenFromAPIResponse";

export type Params = {
    chatId: extendedTypes.MongooseObjectId | null | undefined;
    messageId: extendedTypes.MongooseObjectId | null | undefined;
};

export type Response = {
    _id: extendedTypes.MongooseObjectId;
    author: {
        _id: extendedTypes.MongooseObjectId;
        accountTag: string;
        preferences: {
            displayName: string;
            profileImage: {
                _id: extendedTypes.MongooseObjectId;
                url: string;
                alt: string;
            } | null;
        };
    };
    text: string;
    images: {
        _id: extendedTypes.MongooseObjectId;
        url: string;
        alt: string;
    }[];
    replyingTo: {
        _id: extendedTypes.MongooseObjectId;
        author: {
            _id: extendedTypes.MongooseObjectId;
            accountTag: string;
            preferences: {
                displayName: string;
                profileImage: {
                    _id: extendedTypes.MongooseObjectId;
                    url: string;
                    alt: string;
                } | null;
            };
        };
        text: string;
        images: {
            _id: extendedTypes.MongooseObjectId;
            url: string;
            alt: string;
        }[];
        replyingTo: extendedTypes.MongooseObjectId | null;
        deleted: boolean;
        createdAt: string;
    } | null;
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

export default getChatMessage;
