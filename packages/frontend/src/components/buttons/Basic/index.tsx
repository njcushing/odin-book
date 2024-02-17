import React from "react";
import styles from "./index.module.css";

type BasicTypes = {
    type?: "button" | "reset" | "submit";
    text?: string;
    label?: string;
    symbol?: string;
    onClickHandler?: ((event?: React.MouseEvent<HTMLButtonElement>) => void) | null;
    onSubmitHandler?: ((event?: React.FormEvent<HTMLButtonElement>) => void) | null;
    disabled?: boolean;
    palette?: "primary" | "secondary" | "bare" | "red" | "orange" | "green" | "blue";
    animation?: "rigid" | "squishy";
    style?: {
        shape?: "sharp" | "rounded";
    };
    otherStyles?: React.CSSProperties;
    children?: React.ReactElement | null;
};

function Basic({
    type = "button",
    text = "Button",
    label = "",
    symbol = "",
    onClickHandler = null,
    onSubmitHandler = null,
    disabled = false,
    palette = "primary",
    animation = "rigid",
    style = {
        shape: "rounded",
    },
    otherStyles = {},
    children = null,
}: BasicTypes) {
    return (
        <button
            // eslint-disable-next-line react/button-has-type
            type={type}
            className={styles["button"]}
            aria-label={label}
            onClick={(e) => {
                if (onClickHandler) onClickHandler(e);
                e.currentTarget.blur();
                e.preventDefault();
            }}
            onSubmit={(e) => {
                if (onSubmitHandler) onSubmitHandler(e);
                e.currentTarget.blur();
                e.preventDefault();
            }}
            onMouseLeave={(e) => {
                e.currentTarget.blur();
            }}
            style={{
                borderRadius: style.shape === "sharp" ? "0px" : "9999px",

                ...otherStyles,
            }}
            disabled={disabled}
            data-palette={palette}
            data-animation={animation}
        >
            {symbol && symbol.length > 0 && (
                <p className={`material-symbols-rounded ${styles["button-symbol"]}`}>{symbol}</p>
            )}
            {text}
            {children}
        </button>
    );
}

export default Basic;
