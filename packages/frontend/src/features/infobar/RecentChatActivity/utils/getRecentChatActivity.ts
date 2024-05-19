import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import mongoose from "mongoose";
import saveTokenFromAPIResponse from "@/utils/saveTokenFromAPIResponse";
import { Response as GetChatOverviewResponse } from "@/features/chat/utils/getChatOverview";

export type Params = {
    userId: mongoose.Types.ObjectId | null | undefined;
};

export type Response = GetChatOverviewResponse[] | null;

const getRecentChatActivity: apiFunctionTypes.GET<Params, Response> = async (
    data,
    abortController = null,
) => {
    const { userId } = data.params as Params;

    if (!userId) {
        return {
            status: 400,
            message: "No userId provided to route path",
            data: null,
        };
    }

    const queryObject = { limit: "3" };
    const urlParams = new URLSearchParams();
    Object.entries(queryObject).forEach(([key, value]) => {
        if (value !== "" && value !== undefined && value !== null) {
            urlParams.append(key, `${value}`);
        }
    });

    const result = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/user/${userId}/chat-activity?${urlParams}`,
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
                data: responseJSON.data ? responseJSON.data.chatActivity : null,
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

export default getRecentChatActivity;
