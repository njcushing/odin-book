import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import * as extendedTypes from "@shared/utils/extendedTypes";
import saveTokenFromAPIResponse from "@/utils/saveTokenFromAPIResponse";

export type Params = {
    userId: extendedTypes.MongoDBObjectId | null | undefined;
    after: string | null;
};

export type Response =
    | {
          _id: extendedTypes.MongoDBObjectId;
          owner: extendedTypes.MongoDBObjectId;
          text: string;
          images: extendedTypes.MongoDBObjectId[];
          createdAt: string;
          updatedAt: string;
          likesCount: number;
          repliesCount: number;
          likedByUser: boolean;
      }[]
    | null;

const getUserPosts: apiFunctionTypes.GET<Params, Response> = async (
    data,
    abortController = null,
) => {
    const { userId, after } = data.params as Params;

    if (!userId) {
        return {
            status: 400,
            message: "No userId provided to route path",
            data: null,
        };
    }

    const queryObject = { limit: "10", after };
    const urlParams = new URLSearchParams();
    Object.entries(queryObject).forEach(([key, value]) => {
        if (value !== "" && value !== undefined && value !== null) {
            urlParams.append(key, value);
        }
    });

    const result = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/user/${userId}/posts?${urlParams}`,
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
                data: responseJSON.data.posts,
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

export default getUserPosts;
