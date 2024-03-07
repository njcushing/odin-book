import { Link } from "react-router-dom";
import React from "react";
import * as Types from "./types";
import styles from "./index.module.css";

const defaultStyles: React.CSSProperties = {
    fontSize: "1.1rem",
};

function Option({
    text,
    link = "",
    selected,
    onClickHandler = null,
    minPaddingPx = 16,
    style = {},
}: Types.Option) {
    return (
        <li className={styles["wrapper"]}>
            <Link
                to={link}
                className={styles["option"]}
                aria-label="navigation-option"
                data-highlighted={!!selected}
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    if (onClickHandler) onClickHandler();
                    e.currentTarget.blur();
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.blur();
                }}
            >
                <div
                    className={styles["text"]}
                    style={{
                        ...defaultStyles,
                        ...style,
                        paddingLeft: minPaddingPx,
                        paddingRight: minPaddingPx,
                    }}
                >
                    {text}
                </div>
                <div className={styles["highlight-bar"]}></div>
            </Link>
        </li>
    );
}

export default Option;
