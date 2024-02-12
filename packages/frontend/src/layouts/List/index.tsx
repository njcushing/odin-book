import PropTypes, { InferProps } from "prop-types";
import * as extendedPropTypes from "@/utils/extendedPropTypes";
import { v4 as uuidv4 } from "uuid";
import styles from "./index.module.css";

const defaultStyles = {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    flexWrap: "nowrap",
    gap: "6px",
    width: "100%",
    height: "auto",
    padding: "6px",
    margin: "0px",
};

function List({
    label,
    ordered,
    listItems,
    scrollable,
    listStyles,
}: InferProps<typeof List.propTypes>) {
    const ListComponent = ordered ? "ol" : "ul";

    const items = listItems ? listItems.map((item) => ({ item, key: uuidv4() })) : [];

    let stylesConcatenated = { ...defaultStyles };
    if (listStyles) stylesConcatenated = { ...stylesConcatenated, ...listStyles };

    return (
        <div className={styles["wrapper"]}>
            <div className={styles["container"]}>
                <div className={styles[`${scrollable ? "scrollable-wrapper" : ""}`]}>
                    <ListComponent
                        className={styles["list"]}
                        aria-label={label}
                        style={
                            listStyles
                                ? {
                                      ...stylesConcatenated,
                                      width: `calc(${stylesConcatenated.width} - (2 * ${stylesConcatenated.padding}))`,
                                      height: `calc(${stylesConcatenated.height} - (2 * ${stylesConcatenated.padding}))`,
                                  }
                                : {}
                        }
                    >
                        {items.map((item) => item.item)}
                    </ListComponent>
                </div>
            </div>
        </div>
    );
}

List.propTypes = {
    label: PropTypes.string.isRequired,
    ordered: PropTypes.bool,
    listItems: PropTypes.arrayOf(PropTypes.element),
    scrollable: PropTypes.bool,
    listStyles: PropTypes.exact({
        flexDirection: PropTypes.oneOf(["row", "column"]),
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
        gap: extendedPropTypes.cssSizeRequired,
        width: extendedPropTypes.cssSizeRequired,
        height: extendedPropTypes.cssSizeRequired,
        padding: extendedPropTypes.cssSizeRequired,
        margin: extendedPropTypes.cssSizeRequired,
    }),
};

List.defaultProps = {
    ordered: false,
    listItems: [],
    scrollable: true,
    listStyles: { ...defaultStyles },
};

export default List;
