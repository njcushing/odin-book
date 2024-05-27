import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import saveTokenFromAPIResponse from "@/utils/saveTokenFromAPIResponse";

export type Params = null;

export type Body = {
    accountTag: string;
    password: string;
};

export type Response = null;

const login: apiFunctionTypes.POST<Params, Body, Response> = async (
    data,
    abortController = null,
) => {
    let body;
    if (data && data.body) body = data.body;

    const result = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/auth/login`, {
        signal: abortController ? abortController.signal : null,
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
        .then(async (response) => {
            const responseJSON = await response.json();
            saveTokenFromAPIResponse(responseJSON);

            return {
                status: responseJSON.status,
                message: responseJSON.message,
                data: null,
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

export default login;
