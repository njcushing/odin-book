import { Link } from "react-router-dom";
import * as Types from "../../types";
import styles from "./index.module.css";

function Option({ text, symbol, onClickHandler, link, highlighted, style }: Types.Option) {
    const symbolElement =
        symbol && symbol.length > 0 ? (
            <p className={`material-symbols-rounded ${styles["symbol"]}`}>{symbol}</p>
        ) : null;
    const textElement = text && text.length > 0 ? <p className={styles["text"]}>{text}</p> : null;

    return (
        <div className={styles["wrapper"]}>
            <Link
                to={link || ""}
                className={styles["link"]}
                aria-label="navigation-option"
                onClick={(e) => {
                    if (onClickHandler) onClickHandler(e);
                    e.currentTarget.blur();
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.blur();
                }}
                data-highlighted={highlighted || false}
                style={{ ...style }}
            >
                {symbolElement}
                {textElement}
            </Link>
        </div>
    );
}

export default Option;
