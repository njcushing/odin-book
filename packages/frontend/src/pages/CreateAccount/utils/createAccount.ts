import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import saveTokenFromAPIResponse from "@/utils/saveTokenFromAPIResponse";

const createAccount: apiFunctionTypes.POST = async (data, abortController = null) => {
    let body;
    if (data && data.body) body = data.body;

    const result = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/user/create-account`, {
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

export default createAccount;
