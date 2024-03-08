import React from "react";
import * as Types from "../../types";
import getSizes from "../../utils/getSizes";
import styles from "./index.module.css";

export type ErrorTypes = {
    text: string;
    style?: React.CSSProperties;
} & Types.Sizes;

function Error({ text, style = {}, size = "m" }: ErrorTypes) {
    const sizes = getSizes(size, "error");

    return text && text.length > 0 ? (
        <h3
            className={styles["error"]}
            aria-label="input field error"
            style={style && { ...style, ...sizes }}
        >
            {text}
        </h3>
    ) : null;
}

export default Error;
