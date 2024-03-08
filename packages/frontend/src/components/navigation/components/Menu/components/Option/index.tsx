import { Link } from "react-router-dom";
import styles from "./index.module.css";

export type OptionTypes = {
    text?: string;
    symbol?: string;
    onClickHandler?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
    link?: string;
    highlighted?: boolean;
    style?: React.CSSProperties;
};

function Option({ text, symbol, onClickHandler, link, highlighted, style }: OptionTypes) {
    const symbolElement =
        symbol && symbol.length > 0 ? (
            <p className={`material-symbols-rounded ${styles["symbol"]}`}>{symbol}</p>
        ) : null;
    const textElement = text && text.length > 0 ? <p className={styles["text"]}>{text}</p> : null;

    return (
        <li className={styles["wrapper"]}>
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
        </li>
    );
}

export default Option;
