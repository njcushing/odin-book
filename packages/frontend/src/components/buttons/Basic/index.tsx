import React from "react";
import styles from "./index.module.css";

type BasicTypes = {
    type?: "button" | "reset" | "submit";
    text?: string;
    symbol?: string;
    onClickHandler?: ((event?: React.MouseEvent<HTMLButtonElement>) => void) | null;
    onSubmitHandler?: ((event?: React.FormEvent<HTMLButtonElement>) => void) | null;
    disabled?: boolean;
    palette?: "primary" | "secondary" | "bare" | "red" | "orange" | "green" | "blue";
    style?: {
        shape?: "sharp" | "rounded";
    };
    otherStyles?: React.CSSProperties;
};

function Basic({
    type = "button",
    text = "Button",
    symbol = "",
    onClickHandler = null,
    onSubmitHandler = null,
    disabled = false,
    palette = "primary",
    style = {
        shape: "rounded",
    },
    otherStyles = {},
}: BasicTypes) {
    return (
        <button
            // eslint-disable-next-line react/button-has-type
            type={type}
            className={styles["button"]}
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
        >
            {symbol && symbol.length > 0 && (
                <p className={`material-symbols-rounded ${styles["button-symbol"]}`}>{symbol}</p>
            )}
            {text}
        </button>
    );
}

export default Basic;
