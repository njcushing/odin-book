import { Link } from "react-router-dom";
import PropTypes, { InferProps } from "prop-types";
import * as extendedPropTypes from "@/utils/extendedPropTypes";
import styles from "./index.module.css";

const defaultStyles = {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flexWrap: "nowrap",
    gap: "6px",
    fontSize: "24px",
    width: "100%",
    height: "auto",
    padding: "6px",
    margin: "0px",
};

function Option({
    text,
    symbol,
    onClickHandler,
    link,
    style,
}: InferProps<typeof Option.propTypes>) {
    const symbolElement =
        symbol && symbol.length > 0 ? (
            <p className={`material-symbols-rounded ${styles["symbol"]}`}>{symbol}</p>
        ) : null;
    const textElement = text && text.length > 0 ? <p className={styles["text"]}>{text}</p> : null;

    let stylesConcatenated = { ...defaultStyles };
    if (style) stylesConcatenated = { ...stylesConcatenated, ...style };

    return (
        <div className={styles["wrapper"]}>
            <Link
                to={link || ""}
                className={styles["link"]}
                aria-label="navigation-option"
                onClick={(e) => {
                    if (onClickHandler) onClickHandler(e);
                    e.currentTarget.blur();
                    e.preventDefault();
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.blur();
                }}
                style={stylesConcatenated}
            >
                {symbolElement}
                {textElement}
            </Link>
        </div>
    );
}

Option.propTypes = {
    text: PropTypes.string,
    symbol: PropTypes.string,
    onClickHandler: PropTypes.func,
    link: PropTypes.string,
    style: PropTypes.exact({
        flexDirection: PropTypes.oneOf(["row", "column", "row-reverse", "column-reverse"]),
        justifyContent: PropTypes.oneOf([
            "flex-start",
            "center",
            "flex-end",
            "space-between",
            "space-around",
            "space-evenly",
        ]),
        alignItems: PropTypes.oneOf([
            "flex-start",
            "center",
            "flex-end",
            "space-between",
            "space-around",
            "space-evenly",
        ]),
        flexWrap: PropTypes.oneOf(["nowrap", "wrap", "wrap-reverse"]),
        gap: extendedPropTypes.cssSize,
        fontSize: extendedPropTypes.cssSize,
        width: extendedPropTypes.cssSize,
        height: extendedPropTypes.cssSize,
        padding: extendedPropTypes.cssSize,
        margin: extendedPropTypes.cssSize,
    }),
};

Option.defaultProps = {
    text: "",
    symbol: "",
    onClickHandler: null,
    link: "",
    style: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        flexWrap: "nowrap",
        gap: "6px",
        fontSize: "30px",
        width: "100%",
        height: "auto",
        padding: "6px",
        margin: "0px",
    },
};

export default Option;
