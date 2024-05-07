import * as validation from "./utils/validation";

export type Base<T> = {
    labelText: string;
    fieldId: string;
    fieldName: string;
    initialValue?: T;
    onChangeHandler?: ((event: React.ChangeEvent<HTMLInputElement>) => void) | null;
    onInvalidHandler?: (() => void) | null;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
};

export type Placeholder = {
    placeholder?: string | null;
};

export type Error = {
    errorMessage?: string | null;
    displayErrorOnMount?: boolean;
};

export type Validator<T> = {
    validator?: validation.Validator<T>;
};

export type Length = {
    minLength?: number;
    maxLength?: number;
    counter?: boolean;
};

export type Sizes = {
    size?: "xs" | "s" | "m" | "l" | "xl";
};
