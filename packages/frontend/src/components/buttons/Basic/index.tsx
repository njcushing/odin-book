import * as Types from "../types";
import styles from "./index.module.css";

function Basic({
    type = "button",
    text = "Button",
    symbol = "",
    label = "",
    onClickHandler = null,
    disabled = false,
    palette = "primary",
    animation = "rigid",
    style = {
        shape: "rounded",
    },
    otherStyles = {},
    children = null,
}: Types.Basic) {
    return (
        <button
            // eslint-disable-next-line react/button-has-type
            type={type}
            className={styles["button"]}
            aria-label={label}
            onClick={(e) => {
                if (onClickHandler) onClickHandler(e);
                e.currentTarget.blur();
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
                <p className={`material-symbols-rounded ${styles["symbol"]}`}>{symbol}</p>
            )}
            {text}
            {children}
        </button>
    );
}

export default Basic;
