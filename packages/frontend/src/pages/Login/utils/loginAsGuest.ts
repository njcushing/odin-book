import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import saveTokenFromAPIResponse from "@/utils/saveTokenFromAPIResponse";

export type Params = null;

export type Response = null;

const getAllUsers: apiFunctionTypes.GET<Params, Response> = async (
    data,
    abortController = null,
) => {
    const result = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/auth/login-as-guest`, {
        signal: abortController ? abortController.signal : null,
        method: "GET",
        mode: "cors",
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

export default getAllUsers;
