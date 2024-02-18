import * as extendedTypes from "@/utils/extendedTypes";

const validateField = (
    fieldValue: unknown,
    validator: extendedTypes.Validator<any>,
    required: boolean,
): { status: boolean; message: string | null } => {
    const args = (validator && validator.args) || [];
    const validValue =
        validator && validator.func
            ? validator.func(fieldValue, "front", args)
            : { status: true, message: null };
    if (!required && (!fieldValue || fieldValue === "")) {
        validValue.status = true;
    }
    return validValue;
};

export default validateField;
