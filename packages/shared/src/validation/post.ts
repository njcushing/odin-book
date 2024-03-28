import * as extendedTypes from "@shared/utils/extendedTypes";
import isStringBase64 from "@shared/utils/isStringBase64";

const maximumImageSize = 0;

type ReturnTypes = {
    status: boolean;
    message: string;
};

export const text = (value: string, messageType: "front" | "back"): ReturnTypes => {
    if (value.length > 500) {
        return {
            status: false,
            message:
                messageType === "front"
                    ? "Post text must be at most 500 characters in length."
                    : "'text' field (String) must be at most 500 characters in length",
        };
    }
    return {
        status: true,
        message: messageType === "front" ? "Valid post text." : "'text' field (String) is valid",
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
                    ? `Post image must be a Typed Array.`
                    : `'image' field must be a Typed Array.`,
        };
    }
    if (value.length > 2000000) {
        return {
            status: false,
            message:
                messageType === "front"
                    ? `Post image must be smaller than 2MB.`
                    : `'image' field (Array) must be smaller than 2MB.`,
        };
    }
    return {
        status: true,
        message: messageType === "front" ? `Valid post image.` : `'image' field (Array) is valid`,
    };
};

export const imageBase64 = (value: string, messageType: "front" | "back"): ReturnTypes => {
    if (!isStringBase64(value)) {
        return {
            status: false,
            message:
                messageType === "front"
                    ? `Post image must be a base64-encoded string.`
                    : `'image' field must be a base64-encoded string.`,
        };
    }
    const binary = atob(value);
    const fileSize = binary.length;
    if (fileSize > 2000000) {
        return {
            status: false,
            message:
                messageType === "front"
                    ? `Post image must be smaller than 2MB.`
                    : `'image' field (Array) must be smaller than 2MB.`,
        };
    }
    return {
        status: true,
        message: messageType === "front" ? `Valid post image.` : `'image' field (string) is valid`,
    };
};
