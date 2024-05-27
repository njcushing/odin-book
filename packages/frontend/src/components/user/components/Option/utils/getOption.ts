import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import mongoose from "mongoose";
import saveTokenFromAPIResponse from "@/utils/saveTokenFromAPIResponse";

export type Params = {
    userId: mongoose.Types.ObjectId | null | undefined;
};

export type Response = {
    _id: mongoose.Types.ObjectId;
    accountTag: string;
    preferences: {
        displayName: string;
        profileImage?: {
            _id: mongoose.Types.ObjectId;
            url: string;
            alt: string;
        } | null;
    };
    isFollowing: boolean;
} | null;

const getOption: apiFunctionTypes.GET<Params, Response> = async (data, abortController = null) => {
    const { userId } = data.params as Params;

    if (!userId) {
        return {
            status: 400,
            message: "No userId provided to route path",
            data: null,
        };
    }

    const result = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/${userId}/option`, {
        signal: abortController ? abortController.signal : null,
        method: "GET",
        mode: "cors",
        headers: {
            Authorization: localStorage.getItem("odin-book-auth-token") || "",
        },
    })
        .then(async (response) => {
            const responseJSON = await response.json();
            saveTokenFromAPIResponse(responseJSON);

            return {
                status: responseJSON.status,
                message: responseJSON.message,
                data: responseJSON.data ? responseJSON.data.user : null,
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

export default getOption;
