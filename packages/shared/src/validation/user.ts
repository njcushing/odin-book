import * as extendedTypes from "@shared/utils/extendedTypes";
import isStringBase64 from "@shared/utils/isStringBase64";

const maximumImageSize = 2000000;

type ReturnTypes = {
    status: boolean;
    message: string;
};

export const accountTag = (value: string, messageType: "front" | "back"): ReturnTypes => {
    const pattern = /^[a-zA-Z0-9]*$/;
    if (value.length === 0) {
        return {
            status: false,
            message:
                messageType === "front"
                    ? "Account Tag must not be empty."
                    : "'accountTag' field (String) be at least 5 characters in length",
        };
    }
    if (!value.match(pattern)) {
        return {
            status: false,
            message:
                messageType === "front"
                    ? "Account Tag must only contain alphanumeric characters."
                    : "'accountTag' field (String) must only contain alphanumeric characters",
        };
    }
    if (value.length < 5) {
        return {
            status: false,
            message:
                messageType === "front"
                    ? "Account Tag must be at least 5 characters in length."
                    : "'accountTag' field (String) must be at least 5 characters in length",
        };
    }
    return {
        status: true,
        message:
            messageType === "front" ? "Valid Account Tag." : "'accountTag' field (String) is valid",
    };
};

export const email = (value: string, messageType: "front" | "back"): ReturnTypes => {
    const pattern =
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    if (value.length === 0) {
        return {
            status: false,
            message:
                messageType === "front"
                    ? "Email must not be empty."
                    : "'email' field (String) must not be empty",
        };
    }
    if (!value.match(pattern)) {
        return {
            status: false,
            message:
                messageType === "front"
                    ? "Email must be in the format: 'name@company.com'."
                    : "'email' field (String) be in the format: 'name@company.com'",
        };
    }
    return {
        status: true,
        message: messageType === "front" ? "Valid Email." : "'email' field (String) is valid",
    };
};

const passwordValidator = (
    value: string,
    messageType: "front" | "back",
    confirming: boolean = false,
): ReturnTypes => {
    const pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (value.length === 0) {
        return {
            status: false,
            message:
                messageType === "front"
                    ? `${confirming ? "Confirm " : ""}Password must not be empty.`
                    : `'${confirming ? "confirmP" : "p"}assword' field (String) must not be empty`,
        };
    }
    if (!value.match(pattern)) {
        return {
            status: false,
            message:
                messageType === "front"
                    ? `${confirming ? "Confirm " : ""}Password must
                      contain at least 8 characters, including at least one letter
                      from a-z, at least one number from 0-9, and at least one of the
                      following symbols: @$!%*#?&`
                    : `'${confirming ? "confirmP" : "p"}assword' field (String)
                      must contain at least 8 characters, including at least one
                      letter from a-z, at least one number from 0-9, and at least one
                      of the following symbols: @$!%*#?&`,
        };
    }
    return {
        status: true,
        message:
            messageType === "front"
                ? `Valid ${confirming ? "Confirm " : ""}Password.`
                : `'${confirming ? "confirmP" : "p"}assword' field (String) is valid`,
    };
};
export const password = (value: string, messageType: "front" | "back"): ReturnTypes => {
    return passwordValidator(value, messageType, false);
};
export const confirmPassword = (value: string, messageType: "front" | "back"): ReturnTypes => {
    return passwordValidator(value, messageType, true);
};

export const displayName = (value: string, messageType: "front" | "back"): ReturnTypes => {
    const pattern = /^[a-zA-Z0-9]*$/;
    if (!value.match(pattern)) {
        return {
            status: false,
            message:
                messageType === "front"
                    ? "Display Name must only contain alphanumeric characters."
                    : "'displayName' field (String) must only contain alphanumeric characters",
        };
    }
    if (value.length > 50) {
        return {
            status: false,
            message:
                messageType === "front"
                    ? "Display Name must be at most 50 characters in length."
                    : "'displayName' field (String) must be at most 50 characters in length",
        };
    }
    return {
        status: true,
        message:
            messageType === "front"
                ? "Valid Display Name."
                : "'displayName' field (String) is valid",
    };
};

export const bio = (value: string, messageType: "front" | "back"): ReturnTypes => {
    if (value.length > 500) {
        return {
            status: false,
            message:
                messageType === "front"
                    ? "Bio must be at most 500 characters in length."
                    : "'bio' field (String) must be at most 500 characters in length",
        };
    }
    return {
        status: true,
        message: messageType === "front" ? "Valid Bio." : "'bio' field (String) is valid",
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
                    ? `Image must be a Typed Array.`
                    : `'image' field must be a Typed Array.`,
        };
    }
    if (value.length > maximumImageSize) {
        return {
            status: false,
            message:
                messageType === "front"
                    ? `Image must be smaller than 2MB.`
                    : `'image' field (Array) must be smaller than 2MB.`,
        };
    }
    return {
        status: true,
        message: messageType === "front" ? `Valid image.` : `'image' field (Array) is valid`,
    };
};

export const imageBase64 = (value: string, messageType: "front" | "back"): ReturnTypes => {
    const metadataRemoved = value.slice(value.indexOf(",") + 1);
    if (!isStringBase64(metadataRemoved)) {
        return {
            status: false,
            message:
                messageType === "front"
                    ? `Image must be a base64-encoded string.`
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
                    ? `Image must be smaller than 2MB.`
                    : `'image' field (Array) must be smaller than 2MB.`,
        };
    }
    return {
        status: true,
        message: messageType === "front" ? `Valid image.` : `'image' field (string) is valid`,
    };
};

export const themeOptions = [
    { text: "Default", value: "default" },
    { text: "Light", value: "light" },
    { text: "Dark", value: "dark" },
];

export const theme = (value: string, messageType: "front" | "back"): ReturnTypes => {
    if (!themeOptions.some((option) => option.value === value)) {
        return {
            status: false,
            message:
                messageType === "front"
                    ? `Theme must be one of the following: ${themeOptions.map((option) => option.value)}.`
                    : `'theme' field (String) must be one of the following: ${themeOptions.map((option) => option.value)}`,
        };
    }
    return {
        status: true,
        message: messageType === "front" ? "Valid Theme." : "'theme' field (String) is valid",
    };
};
