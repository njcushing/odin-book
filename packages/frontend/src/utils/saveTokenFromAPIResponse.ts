const saveTokenFromAPIResponse = async (response: { data?: { token?: string } }) => {
    if (
        response.data !== null &&
        typeof response.data === "object" &&
        "token" in response.data &&
        typeof response.data.token === "string"
    ) {
        localStorage.setItem("odin-book-auth-token", response.data.token);
    }
};

export default saveTokenFromAPIResponse;
