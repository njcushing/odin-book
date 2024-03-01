import { useState } from "react";
import * as extendedTypes from "@/utils/extendedTypes";
import * as Types from "../../types";
import * as validation from "../../utils/validation";
import getSizes from "../../utils/getSizes";
import Inputs from "../..";
import styles from "./index.module.css";

type Custom = { type?: "text" | "email" | "password"; description?: string };

type TextTypes = Types.Base &
    Types.Placeholder &
    Types.Error &
    Types.Validator<string> &
    Types.Sizes &
    Types.Length &
    Custom;

function Text({
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
    type = "text",
    description = "",
}: TextTypes) {
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
            <input
                className={styles[`input${currentErrorMessage.length > 0 ? "-error" : ""}`]}
                type={type}
                id={fieldId}
                name={fieldName}
                defaultValue={value}
                style={{
                    resize: "none",
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
            ></input>
            {counter && <Inputs.Counter count={value.length} maxLength={maxLength} size={size} />}
            {!disabled && currentErrorMessage.length > 0 ? (
                <Inputs.Error text={currentErrorMessage} size={size} />
            ) : null}
        </div>
    );
}

export default Text;
