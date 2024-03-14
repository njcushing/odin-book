export type Validator<T> = {
    func: (
        value: T,
        messageType: "front" | "back",
        ...args: unknown[]
    ) => {
        status: boolean;
        message: string | null;
    };
    args?: unknown[];
} | null;

export function validate<T>(
    fieldValue: T,
    validator: Validator<T>,
    required: boolean,
): { status: boolean; message: string | null } {
    const args = (validator && validator.args) || [];
    const validValue =
        validator && validator.func
            ? validator.func(fieldValue, "front", args)
            : { status: true, message: null };
    if (required) {
        if (!fieldValue) validValue.status = false;
        if (fieldValue === "") validValue.status = false;
    }
    return validValue;
}
