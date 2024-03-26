import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import saveTokenFromAPIResponse from "@/utils/saveTokenFromAPIResponse";
import convertTypedArrayToBase64 from "@/utils/convertTypedArrayToBase64";

export type Body = {
    text: string;
    images: number[][];
};

export type Response = string | null;

const createPost: apiFunctionTypes.POST<Body, Response> = async (data, abortController = null) => {
    let body;
    if (data && data.body) body = data.body;

    if (body) {
        body.images.map((image) => convertTypedArrayToBase64(image));
    }

    const result = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/post/create`, {
        signal: abortController ? abortController.signal : null,
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("odin-book-auth-token") || "",
        },
        body: JSON.stringify(body),
    })
        .then(async (response) => {
            const responseJSON = await response.json();
            saveTokenFromAPIResponse(responseJSON);

            return {
                status: responseJSON.status,
                message: responseJSON.message,
                data: "",
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
