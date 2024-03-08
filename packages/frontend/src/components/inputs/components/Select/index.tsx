import { useState } from "react";
import * as extendedTypes from "@shared/utils/extendedTypes";
import * as Types from "../../types";
import * as validation from "../../utils/validation";
import getSizes from "../../utils/getSizes";
import Inputs from "../..";
import styles from "./index.module.css";

/* Overriding onChangeHandler's type in Types.Base; designed for HTMLInputElement */

type Custom = {
    onChangeHandler?: ((event: React.ChangeEvent<HTMLSelectElement>) => void) | null;
    options: string[];
    description?: string;
};

export type SelectTypes = Types.Base<string> &
    Types.Error &
    Types.Validator<string> &
    Types.Sizes &
    Custom;

function Select({
    labelText,
    fieldId,
    fieldName,
    initialValue = "",
    onChangeHandler = null,
    disabled = false,
    required = false,
    errorMessage = "",
    validator = null,
    size = "s",
    options = [],
    description = "",
}: SelectTypes) {
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
            <select
                className={styles[`select${currentErrorMessage.length > 0 ? "-error" : ""}`]}
                id={fieldId}
                name={fieldName}
                defaultValue={value}
                style={{
                    resize: "none",
                    ...sizes,
                }}
                onChange={(e) => {
                    const validValue = validation.validate(
                        options[e.target.selectedIndex],
                        validator || validator,
                        required,
                    );
                    setValue(options[e.target.selectedIndex]);
                    setError(!validValue.status && validValue.message ? validValue.message : "");
                    if (onChangeHandler) onChangeHandler(e);
                }}
                disabled={disabled || false}
            >
                {options.map((option) => {
                    return (
                        <option className={styles["select-option"]} value={option} key={option}>
                            {option}
                        </option>
                    );
                })}
            </select>
            {!disabled && currentErrorMessage.length > 0 ? (
                <Inputs.Error text={currentErrorMessage} size={size} />
            ) : null}
        </div>
    );
}

export default Select;
