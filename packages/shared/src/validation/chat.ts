type ReturnTypes = {
    status: boolean;
    message: string;
};

export const name = (value: string, messageType: "front" | "back"): ReturnTypes => {
    if (value.length > 50) {
        return {
            status: false,
            message:
                messageType === "front"
                    ? "Name must be at most 50 characters in length."
                    : "'name' field (String) must be at most 50 characters in length",
        };
    }
    return {
        status: true,
        message: messageType === "front" ? "Valid name." : "'name' field (String) is valid",
    };
};
