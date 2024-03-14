type ReturnTypes = {
    status: boolean;
    message: string;
};

export const text = (value: string, messageType: "front" | "back"): ReturnTypes => {
    if (value.length > 1000) {
        return {
            status: false,
            message:
                messageType === "front"
                    ? "Text must be at most 1000 characters in length."
                    : "'text' field (String) must be at most 1000 characters in length",
        };
    }
    return {
        status: true,
        message: messageType === "front" ? "Valid text." : "'text' field (String) is valid",
    };
};
