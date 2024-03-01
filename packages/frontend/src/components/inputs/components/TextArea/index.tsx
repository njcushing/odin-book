import React, { useState } from "react";
import * as extendedTypes from "@/utils/extendedTypes";
import * as Types from "../../types";
import * as validation from "../../utils/validation";
import getSizes from "../../utils/getSizes";
import Inputs from "../..";
import styles from "./index.module.css";

const defaultStyles = {
    resize: "none",

    height: "6rem",
};

/* Overriding onChangeHandler's type in Types.Base; designed for HTMLInputElement */

type Custom = {
    onChangeHandler?: ((event: React.ChangeEvent<HTMLTextAreaElement>) => void) | null;
    description?: string;
    style?: React.CSSProperties;
};

type TextAreaTypes = Types.Base &
    Types.Placeholder &
    Types.Error &
    Types.Validator<string> &
    Types.Sizes &
    Types.Length &
    Custom;

function TextArea({
    labelText,
    fieldId,
    fieldName,
    initialValue = "",
    onChangeHandler = null,
    disabled = false,
    readOnly = false,
    required = false,
    placeholder = "",
    errorMessage = "",
    validator = null,
    size = "s",
    minLength,
    maxLength,
    counter = false,
    description = "",
    style = {},
}: TextAreaTypes) {
    const [value, setValue]: [string, extendedTypes.Setter<string>] = useState(initialValue || "");
    const [error, setError]: [string, extendedTypes.Setter<string>] = useState("");

    const sizes = getSizes(size, "input");

    let currentErrorMessage = "";
    if (errorMessage && errorMessage.length > 0) {
        currentErrorMessage = errorMessage;
    } else if (error && error.length > 0) {
        currentErrorMessage = error;
    }

    return (
        <div className={styles["wrapper"]}>
            <Inputs.Label labelText={labelText} fieldId={fieldId} required={required} size={size} />
            <Inputs.Description text={description} size={size} />
            <textarea
                className={styles[`input${currentErrorMessage.length > 0 ? "-error" : ""}`]}
                id={fieldId}
                name={fieldName}
                defaultValue={value}
                style={{
                    ...defaultStyles,
                    ...style,
                    ...sizes,
                }}
                onChange={(e) => {
                    const validValue = validation.validate(
                        e.target.value,
                        validator || validator,
                        required,
                    );
                    setValue(e.target.value);
                    setError(!validValue.status && validValue.message ? validValue.message : "");
                    if (onChangeHandler) onChangeHandler(e);
                }}
                disabled={disabled || false}
                readOnly={readOnly}
                placeholder={placeholder || ""}
                minLength={minLength}
                maxLength={maxLength}
            ></textarea>
            {counter && <Inputs.Counter count={value.length} maxLength={maxLength} size={size} />}
            {!disabled && currentErrorMessage.length > 0 ? (
                <Inputs.Error text={currentErrorMessage} size={size} />
            ) : null}
        </div>
    );
}

export default TextArea;
