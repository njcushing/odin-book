import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./index.module.css";

type Option = {
    text: string;
    link?: string;
    disabled?: boolean;
};

type HorizontalTypes = {
    options: Option[];
    selected: string | null;
    label?: string;
    minPaddingPx?: number;
    onSelectHandler?: ((event: React.MouseEvent<HTMLAnchorElement>) => void) | null;
    style?: React.CSSProperties;
};

function Horizontal({
    options = [],
    selected = null,
    label = "navigation",
    minPaddingPx = 16,
    onSelectHandler = null,
    style = {},
}: HorizontalTypes) {
    const [optionSelected, setOptionSelected] = useState<string | null>(selected);

    const listRef = useRef<HTMLUListElement>(null);
    const fontSize = style.fontSize || "1.1rem";

    return (
        <nav className={styles["container"]} aria-label={label} style={{ ...style }}>
            <ul className={styles["list"]} ref={listRef}>
                {options.map((option) => {
                    return (
                        <Link
                            to={option.link || ""}
                            className={styles["option"]}
                            data-highlighted={!!(optionSelected === option.text)}
                            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                setOptionSelected(option.text);
                                if (onSelectHandler) onSelectHandler(e);
                                e.currentTarget.blur();
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.blur();
                            }}
                            key={option.text}
                        >
                            <div
                                className={styles["text"]}
                                style={{
                                    fontSize,
                                    paddingLeft: minPaddingPx,
                                    paddingRight: minPaddingPx,
                                }}
                            >
                                {option.text}
                            </div>
                            <div className={styles["highlight-bar"]}></div>
                        </Link>
                    );
                })}
            </ul>
        </nav>
    );
}

export default Horizontal;
