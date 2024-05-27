import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import * as extendedTypes from "@shared/utils/extendedTypes";
import saveTokenFromAPIResponse from "@/utils/saveTokenFromAPIResponse";

export type Params = {
    postId: extendedTypes.MongooseObjectId | null | undefined;
    limit?: number;
    after: extendedTypes.MongooseObjectId | null | undefined;
};

export type Response = extendedTypes.MongooseObjectId[] | null;

const getPostReplies: apiFunctionTypes.GET<Params, Response> = async (
    data,
    abortController = null,
) => {
    const { postId, limit, after } = data.params as Params;

    if (!postId) {
        return {
            status: 400,
            message: "No postId provided to route path",
            data: null,
        };
    }

    const queryObject = { limit: limit || "10", after };
    const urlParams = new URLSearchParams();
    Object.entries(queryObject).forEach(([key, value]) => {
        if (value !== "" && value !== undefined && value !== null) {
            urlParams.append(key, `${value}`);
        }
    });

    const result = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/post/${postId}/replies?${urlParams}`,
        {
            signal: abortController ? abortController.signal : null,
            method: "GET",
            mode: "cors",
            headers: {
                Authorization: localStorage.getItem("odin-book-auth-token") || "",
            },
        },
    )
        .then(async (response) => {
            const responseJSON = await response.json();
            saveTokenFromAPIResponse(responseJSON);

            return {
                status: responseJSON.status,
                message: responseJSON.message,
                data: responseJSON.data ? responseJSON.data.replies : null,
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

export default getPostReplies;
