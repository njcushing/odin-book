import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import mongoose from "mongoose";
import saveTokenFromAPIResponse from "@/utils/saveTokenFromAPIResponse";

export type Params = {
    postId: mongoose.Types.ObjectId | null | undefined;
};

export type Body = null;

export type Response = null;

const likePost: apiFunctionTypes.PUT<Params, Body, Response> = async (
    data,
    abortController = null,
) => {
    const { postId } = data.params as Params;

    if (!postId) {
        return {
            status: 400,
            message: "No postId provided to route path",
            data: null,
        };
    }

    const result = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/post/${postId}/like`, {
        signal: abortController ? abortController.signal : null,
        method: "PUT",
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
            };
        })
        .catch((error) => {
            return {
                status: error.status ? error.status : 500,
                message: error.message,
            };
        });
    return result;
};

export default likePost;
