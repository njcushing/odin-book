import isStringBase64 from "@shared/utils/isStringBase64";

const maximumImageSize = 2000000;

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

export const imageBase64 = (value: string, messageType: "front" | "back"): ReturnTypes => {
    const metadataRemoved = value.slice(value.indexOf(",") + 1);
    if (!isStringBase64(metadataRemoved)) {
        return {
            status: false,
            message:
                messageType === "front"
                    ? `Chat image must be a base64-encoded string.`
                    : `'image' field must be a base64-encoded string.`,
        };
    }
    const binary = atob(metadataRemoved);
    const fileSize = binary.length;
    if (fileSize > maximumImageSize) {
        return {
            status: false,
            message:
                messageType === "front"
                    ? `Chat image must be smaller than 2MB.`
                    : `'image' field (Array) must be smaller than 2MB.`,
        };
    }
    return {
        status: true,
        message: messageType === "front" ? `Valid chat image.` : `'image' field (string) is valid`,
    };
};
