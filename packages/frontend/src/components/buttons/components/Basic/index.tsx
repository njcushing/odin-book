import styles from "./index.module.css";

export type BasicTypes = {
    type?: "button" | "reset" | "submit";
    text?: string;
    symbol?: string;
    label?: string;
    onClickHandler?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | null;
    disabled?: boolean;
    allowDefaultEventHandling?: boolean;
    palette?: "primary" | "secondary" | "bare" | "red" | "orange" | "gold" | "green" | "blue";
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
