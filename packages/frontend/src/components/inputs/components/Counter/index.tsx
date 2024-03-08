import React from "react";
import * as Types from "../../types";
import getSizes from "../../utils/getSizes";
import styles from "./index.module.css";

export type CounterTypes = {
    count: number;
    maxLength?: number;
    style?: React.CSSProperties;
} & Types.Sizes;

function Counter({ count = 0, maxLength, style = {}, size = "m" }: CounterTypes) {
    const sizes = getSizes(size, "counter");

    let counterString = "";
    if (maxLength) counterString = `${count}/${maxLength}`;
    else counterString = `${count}`;

    return (
        <p className={styles["counter"]} style={{ ...sizes, ...style }}>
            {counterString}
        </p>
    );
}

export default Counter;
