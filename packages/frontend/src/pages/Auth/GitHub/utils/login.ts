import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import saveTokenFromAPIResponse from "@/utils/saveTokenFromAPIResponse";

export type Types = apiFunctionTypes.GET<string>;

const getToken: Types = async (data, abortController = null) => {
    if (!data || !data.params || !("code" in data.params)) {
        return {
            status: 400,
            message: "Code must be provided as query parameter",
            data: "",
        };
    }

    const result = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/auth/github/token?code=${data.params.code}`,
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
                data: "",
            };
        })
        .catch((error) => {
            return {
                status: error.status ? error.status : 500,
                message: error.message,
                data: "",
            };
        });
    return result;
};

export default getToken;
