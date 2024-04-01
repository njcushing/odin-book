import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import * as extendedTypes from "@shared/utils/extendedTypes";
import mongoose from "mongoose";
import saveTokenFromAPIResponse from "@/utils/saveTokenFromAPIResponse";

export type Params = {
    postId: mongoose.Types.ObjectId | null | undefined;
};

export type Response = {
    _id: mongoose.Types.ObjectId;
    author: {
        _id: mongoose.Types.ObjectId;
        accountTag: string;
        preferences: {
            displayName: string;
            profileImage: {
                _id: mongoose.Types.ObjectId;
                url: extendedTypes.TypedArray | string;
                alt: string;
            } | null;
        };
    };
    text: string;
    images: {
        _id: mongoose.Types.ObjectId;
        url: extendedTypes.TypedArray | string;
        alt: string;
    }[];
    replyingTo: mongoose.Types.ObjectId | null;
    createdAt: string;
    likesCount: number;
    repliesCount: number;
    likedByUser: boolean;
} | null;

const getPost: apiFunctionTypes.GET<Params, Response> = async (data, abortController = null) => {
    const { postId } = data.params as Params;

    if (!postId) {
        return {
            status: 400,
            message: "No postId provided to route path",
            data: null,
        };
    }

    const result = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/post/${postId}`, {
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
                data: responseJSON.data.post,
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

export default getPost;
