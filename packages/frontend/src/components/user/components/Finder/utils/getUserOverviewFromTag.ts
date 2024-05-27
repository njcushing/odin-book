import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import * as extendedTypes from "@shared/utils/extendedTypes";
import saveTokenFromAPIResponse from "@/utils/saveTokenFromAPIResponse";

export type Params = {
    accountTag: string;
};

export type Response = {
    _id: extendedTypes.MongooseObjectId;
    accountTag: string;
    preferences: {
        displayName: string;
        profileImage?: {
            _id: extendedTypes.MongooseObjectId;
            url: string;
            alt: string;
        } | null;
    };
} | null;

const getUserOverviewFromTag: apiFunctionTypes.GET<Params, Response> = async (
    data,
    abortController = null,
) => {
    const { accountTag } = data.params as Params;

    const queryObject = { accountTag, softCheck: "true" };
    const urlParams = new URLSearchParams();
    Object.entries(queryObject).forEach(([key, value]) => {
        if (value !== "" && value !== undefined && value !== null) {
            urlParams.append(key, value);
        }
    });

    const result = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/user/overviewFromTag?${urlParams}`,
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
                data: responseJSON.data ? responseJSON.data.user : null,
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

export default getUserOverviewFromTag;
