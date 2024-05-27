import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import * as extendedTypes from "@shared/utils/extendedTypes";
import saveTokenFromAPIResponse from "@/utils/saveTokenFromAPIResponse";

export type Params = {
    excludeActiveUser?: boolean;
    after?: extendedTypes.MongooseObjectId | null | undefined;
    limit?: number;
};

export type Response = extendedTypes.MongooseObjectId[] | null;

const getAllUsers: apiFunctionTypes.GET<Params, Response> = async (
    data,
    abortController = null,
) => {
    const { excludeActiveUser, after, limit = "10" } = data.params as Params;

    const queryObject = { excludeActiveUser, after, limit };
    const urlParams = new URLSearchParams();
    Object.entries(queryObject).forEach(([key, value]) => {
        if (value !== "" && value !== undefined && value !== null) {
            urlParams.append(key, `${value}`);
        }
    });

    const result = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/users/all?${urlParams}`, {
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
                data: responseJSON.data ? responseJSON.data.users : null,
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
