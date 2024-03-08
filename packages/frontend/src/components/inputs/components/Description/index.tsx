import React from "react";
import * as Types from "../../types";
import getSizes from "../../utils/getSizes";
import styles from "./index.module.css";

export type DescriptionTypes = {
    text: string;
    style?: React.CSSProperties;
} & Types.Sizes;

function Description({ text, style = {}, size = "m" }: DescriptionTypes) {
    const sizes = getSizes(size, "description");

    return text && text.length > 0 ? (
        <h3
            className={styles["description"]}
            aria-label="input-field-description"
            style={{ ...sizes, ...style }}
        >
            {text}
        </h3>
    ) : null;
}

export default Description;
