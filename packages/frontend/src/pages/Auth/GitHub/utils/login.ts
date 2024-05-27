import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import saveTokenFromAPIResponse from "@/utils/saveTokenFromAPIResponse";

export type Params = {
    code: string;
};

export type Response = null;

const login: apiFunctionTypes.GET<Params, Response> = async (data, abortController = null) => {
    const { code } = data.params as Params;

    const queryObject = { code };
    const urlParams = new URLSearchParams();
    Object.entries(queryObject).forEach(([key, value]) => {
        if (value !== "" && value !== undefined && value !== null) {
            urlParams.append(key, value);
        }
    });

    const result = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/auth/github/login?${urlParams}`,
        {
            signal: abortController ? abortController.signal : null,
            method: "GET",
            mode: "cors",
        },
    )
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
