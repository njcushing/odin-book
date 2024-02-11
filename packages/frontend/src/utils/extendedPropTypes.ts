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

function cssSizeValidator<T>(props: T, propName: string, componentName: string): Error | null {
    const pattern =
        /^(auto|fit-content|max-content|min-content)$|^\d+(\.\d+)?%$|^\d+(\.\d+)?(px|em|rem|vw|vh|vmin|vmax)?$/;
    if (!pattern.test(props[propName as keyof typeof props])) {
        return new Error(
            `Invalid prop ${propName} supplied to ${componentName}. Validation failed. Expected a valid CSS size value.`,
        );
    }
    return null;
}
export const cssSize = cssSizeValidator;
export const cssSizeRequired = createRequiredValidator(cssSizeValidator);
