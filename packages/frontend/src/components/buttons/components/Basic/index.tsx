import * as Types from "../../types";
import styles from "./index.module.css";

function Basic({
    type = "button",
    text = "Button",
    symbol = "",
    label = "",
    onClickHandler = null,
    disabled = false,
    allowDefaultEventHandling = false,
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
                if (!allowDefaultEventHandling) e.preventDefault();
            }}
            onMouseLeave={(e) => {
                e.currentTarget.blur();
                if (!allowDefaultEventHandling) e.preventDefault();
            }}
            style={{ ...otherStyles }}
            data-shape={style.shape}
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
