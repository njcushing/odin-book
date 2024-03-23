import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import saveTokenFromAPIResponse from "@/utils/saveTokenFromAPIResponse";
import { UserTypes } from "..";

const getActiveUser: apiFunctionTypes.GET<UserTypes> = async (data, abortController = null) => {
    const result = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/user/active`, {
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
                data: responseJSON.data,
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

export default getActiveUser;
