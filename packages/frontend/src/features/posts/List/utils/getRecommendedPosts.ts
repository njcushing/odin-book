import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import * as extendedTypes from "@shared/utils/extendedTypes";
import saveTokenFromAPIResponse from "@/utils/saveTokenFromAPIResponse";

export type Params = {
    userId: extendedTypes.MongooseObjectId | null | undefined;
    excludeActiveUser?: boolean;
    after?: extendedTypes.MongooseObjectId | null | undefined;
    limit?: number;
};

export type Response =
    | {
          _id: extendedTypes.MongooseObjectId;
          replyingTo: extendedTypes.MongooseObjectId | null;
          createdAt: string;
      }[]
    | null;

const getRecommendedPosts: apiFunctionTypes.GET<Params, Response> = async (
    data,
    abortController = null,
) => {
    const { userId, excludeActiveUser, after, limit = "10" } = data.params as Params;

    if (!userId) {
        return {
            status: 400,
            message: "No userId provided to route path",
            data: null,
        };
    }

    const queryObject = { excludeActiveUser, after, limit };
    const urlParams = new URLSearchParams();
    Object.entries(queryObject).forEach(([key, value]) => {
        if (value !== "" && value !== undefined && value !== null) {
            urlParams.append(key, `${value}`);
        }
    });

    const result = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/user/${userId}/recommended-posts?${urlParams}`,
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
                data: responseJSON.data ? responseJSON.data.posts : null,
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

export default getRecommendedPosts;
