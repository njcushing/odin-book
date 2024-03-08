import { Link } from "react-router-dom";
import React from "react";
import styles from "./index.module.css";

const defaultStyles: React.CSSProperties = {
    fontSize: "1.1rem",
};

export type OptionTypes = {
    text: string;
    link?: string;
    selected?: boolean;
    onClickHandler?: ((event: React.MouseEvent<HTMLAnchorElement>) => void) | null;
    minPaddingPx?: number;
    style?: React.CSSProperties;
};

function Option({
    text,
    link = "",
    selected,
    onClickHandler = null,
    minPaddingPx = 16,
    style = {},
}: OptionTypes) {
    return (
        <li className={styles["wrapper"]}>
            <Link
                to={link}
                className={styles["option"]}
                aria-label="navigation-option"
                data-highlighted={!!selected}
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    if (onClickHandler) onClickHandler(e);
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
