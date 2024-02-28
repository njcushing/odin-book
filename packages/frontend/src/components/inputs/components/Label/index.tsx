import React from "react";
import * as Types from "../../types";
import getSizes from "../../utils/getSizes";
import styles from "./index.module.css";

type LabelTypes = {
    labelText: string;
    fieldId: string;
    required?: boolean;
    style?: React.CSSProperties;
} & Types.Sizes;

function Label({ labelText, fieldId, required = false, style = {}, size = "m" }: LabelTypes) {
    const sizes = getSizes(size, "label");

    return (
        <label
            className={styles["label"]}
            htmlFor={fieldId}
            style={style && { ...style, ...sizes }}
        >
            {`${required ? "*" : ""}${labelText}:`}
        </label>
    );
}

export default Label;
