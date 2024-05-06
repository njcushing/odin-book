import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import saveTokenFromAPIResponse from "@/utils/saveTokenFromAPIResponse";

export function generatePUTAsyncFunction<Response>(route: string, fieldName: string) {
    const func: apiFunctionTypes.PUT<null, { fieldValue: unknown }, Response> = async (
        data,
        abortController = null,
    ) => {
        const { body } = data || {};

        const fieldValue: unknown = body ? body.fieldValue : undefined;

        const result = await fetch(route, {
            signal: abortController ? abortController.signal : null,
            method: "PUT",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("odin-book-auth-token") || "",
            },
            body: JSON.stringify({ [fieldName]: fieldValue }),
        })
            .then(async (apiResponse) => {
                const responseJSON = await apiResponse.json();
                saveTokenFromAPIResponse(responseJSON);

                return {
                    status: responseJSON.status,
                    message: responseJSON.message,
                    data:
                        responseJSON.data && "token" in responseJSON.data
                            ? delete responseJSON.data.token
                            : responseJSON.data,
                };
            })
            .catch((error) => {
                return {
                    status: error.status ? error.status : 500,
                    message: error.message,
                    data: null,
                };
            });

        return result as {
            status: number;
            message: string | null;
            data?: Response | undefined;
        };
    };

    return func;
}

export default generatePUTAsyncFunction;
