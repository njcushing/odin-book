type PropValidator<T> = (props: T, propName: string, componentName: string) => Error | null;

function createRequiredValidator<T>(
    validator: PropValidator<T>,
): PropValidator<T> & { isRequired: boolean } {
    const requiredValidator = (props: T, propName: string, componentName: string): Error | null => {
        if (!props[propName as keyof typeof props]) {
            return new Error(
                `Required prop '${propName}' was not specified in '${componentName}'.`,
            );
        }
        return validator(props, propName, componentName);
    };
    requiredValidator.isRequired = true;
    return requiredValidator;
}

function integerValidator<T>(props: T, propName: string, componentName: string): Error | null {
    const value = props[propName as keyof typeof props];
    if (typeof value !== "number" || !Number.isInteger(value)) {
        return new Error(
            `Invalid prop ${propName} supplied to ${componentName}. Expected an integer.`,
        );
    }
    return null;
}
export const integer = integerValidator;
export const integerRequired = createRequiredValidator(integerValidator);

function cssSizeValidator<T>(props: T, propName: string, componentName: string): Error | null {
    const value = props[propName as keyof typeof props];
    if (value) {
        const pattern =
            /^(auto|fit-content|max-content|min-content)$|^\d+(\.\d+)?%$|^\d+(\.\d+)?(px|em|rem|vw|vh|vmin|vmax)?$/;
        if (value && !pattern.test(value)) {
            return new Error(
                `Invalid prop ${propName} supplied to ${componentName}. Expected a valid CSS size value.`,
            );
        }
    }
    return null;
}
export const cssSize = cssSizeValidator;
export const cssSizeRequired = createRequiredValidator(cssSizeValidator);
