import React from "react";
import * as Types from "../../types";
import getSizes from "../../utils/getSizes";
import styles from "./index.module.css";

type ErrorTypes = {
    text: string;
    style?: React.CSSProperties;
} & Types.Sizes;

function Error({ text, style = {}, size = "m" }: ErrorTypes) {
    const sizes = getSizes(size, "error");

    return (
        <h3
            className={styles["error"]}
            aria-label="text-input-error"
            style={style && { ...style, ...sizes }}
        >
            {text}
        </h3>
    );
}

export default Error;
