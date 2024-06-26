import * as extendedTypes from "@shared/utils/extendedTypes";
import isStringBase64 from "@shared/utils/isStringBase64";

const maximumImageSize = 2000000;

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

export const imageArray = (
    value: extendedTypes.TypedArray,
    messageType: "front" | "back",
): ReturnTypes => {
    if (!extendedTypes.isTypedArray(value)) {
        return {
            status: false,
            message:
                messageType === "front"
                    ? `Message image must be a Typed Array.`
                    : `'image' field must be a Typed Array.`,
        };
    }
    if (value.length > maximumImageSize) {
        return {
            status: false,
            message:
                messageType === "front"
                    ? `Message image must be smaller than 2MB.`
                    : `'image' field (Array) must be smaller than 2MB.`,
        };
    }
    return {
        status: true,
        message:
            messageType === "front" ? `Valid message image.` : `'image' field (Array) is valid`,
    };
};

export const imageBase64 = (value: string, messageType: "front" | "back"): ReturnTypes => {
    const metadataRemoved = value.slice(value.indexOf(",") + 1);
    if (!isStringBase64(metadataRemoved)) {
        return {
            status: false,
            message:
                messageType === "front"
                    ? `Message image must be a base64-encoded string.`
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
                    ? `Message image must be smaller than 2MB.`
                    : `'image' field (Array) must be smaller than 2MB.`,
        };
    }
    return {
        status: true,
        message:
            messageType === "front" ? `Valid message image.` : `'image' field (string) is valid`,
    };
};
