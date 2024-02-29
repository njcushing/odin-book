type returnTypes = {
    status: boolean;
    message: string;
};

export const username = (value: string, messageType: "front" | "back"): returnTypes => {
    const pattern = /^[a-zA-Z0-9]*$/;
    if (value.length === 0) {
        return {
            status: false,
            message:
                messageType === "front"
                    ? "Username must not be empty."
                    : "'username' field (String) be at least 5 characters in length",
        };
    }
    if (!value.match(pattern)) {
        return {
            status: false,
            message:
                messageType === "front"
                    ? "Username must only contain alphanumeric characters."
                    : "'username' field (String) must only contain alphanumeric characters",
        };
    }
    if (value.length < 5) {
        return {
            status: false,
            message:
                messageType === "front"
                    ? "Username must be at least 5 characters in length."
                    : "'username' field (String) must be at least 5 characters in length",
        };
    }
    return {
        status: true,
        message: messageType === "front" ? "Valid Username." : "'username' field (String) is valid",
    };
};

export const email = (value: string, messageType: "front" | "back"): returnTypes => {
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
): returnTypes => {
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
export const password = (value: string, messageType: "front" | "back"): returnTypes => {
    return passwordValidator(value, messageType, false);
};
export const confirmPassword = (value: string, messageType: "front" | "back"): returnTypes => {
    return passwordValidator(value, messageType, true);
};
