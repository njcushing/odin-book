import saveTokenFromAPIResponse from "@/utils/saveTokenFromAPIResponse";

export type Types = (
    data: {
        body: { accountTag: string; email: string; password: string; confirmPassword: string };
    },
    abortController?: AbortController | null,
) => Promise<{
    status: number;
    message: string | null;
}>;

const createAccount: Types = async (data, abortController) => {
    const result = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/user/create-account`, {
        signal: abortController ? abortController.signal : null,
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data.body),
    })
        .then(async (response) => {
            const responseJSON = await response.json();
            saveTokenFromAPIResponse(responseJSON);

            return {
                status: responseJSON.status,
                message: responseJSON.message,
            };
        })
        .catch((error) => {
            return {
                status: error.status ? error.status : 500,
                message: error.message,
            };
        });
    return result;
};

export default createAccount;
