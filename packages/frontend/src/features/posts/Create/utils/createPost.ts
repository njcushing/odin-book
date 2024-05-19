import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import saveTokenFromAPIResponse from "@/utils/saveTokenFromAPIResponse";
import convertArrayBufferToBase64 from "@/utils/convertArrayBufferToBase64";
import mongoose from "mongoose";

export type Body = {
    replyingTo: mongoose.Types.ObjectId | undefined | null;
    text: string;
    images: ArrayBuffer[];
};

export type Response = {
    _id: mongoose.Types.ObjectId;
    replyingTo: mongoose.Types.ObjectId | null;
} | null;

const createPost: apiFunctionTypes.POST<null, Body, Response> = async (
    data,
    abortController = null,
) => {
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

    const result = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/post`, {
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
                data: responseJSON.data ? responseJSON.data.post : null,
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

export default createPost;
