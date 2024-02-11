import PropTypes, { InferProps } from "prop-types";
import * as extendedPropTypes from "@/utils/extendedPropTypes";
import { v4 as uuidv4 } from "uuid";
import styles from "./index.module.css";

function LayoutList({
    label,
    ordered,
    listItems,
    scrollable,
    listStyles,
}: InferProps<typeof LayoutList.propTypes>) {
    const List = ordered ? "ol" : "ul";

    const items = listItems ? listItems.map((item) => ({ item, key: uuidv4() })) : [];

    return (
        <div className={styles["wrapper"]}>
            <div className={styles["container"]}>
                <div className={styles[`${scrollable ? "scrollable-wrapper" : ""}`]}>
                    <List
                        className={styles["list"]}
                        aria-label={label}
                        style={
                            listStyles
                                ? {
                                      flexDirection: listStyles.flexDirection,
                                      gap: listStyles.gap,
                                      width: listStyles.width,
                                      height: listStyles.height,
                                      padding: listStyles.padding,
                                      margin: listStyles.margin,
                                  }
                                : {}
                        }
                    >
                        {items.map((item) => {
                            return (
                                <li className={styles["list-item"]} key={item.key}>
                                    {item.item}
                                </li>
                            );
                        })}
                    </List>
                </div>
            </div>
        </div>
    );
}

LayoutList.propTypes = {
    label: PropTypes.string.isRequired,
    ordered: PropTypes.bool,
    listItems: PropTypes.arrayOf(PropTypes.element),
    scrollable: PropTypes.bool,
    listStyles: PropTypes.exact({
        flexDirection: PropTypes.oneOf(["row", "column"]),
        gap: extendedPropTypes.cssSizeRequired,
        width: extendedPropTypes.cssSizeRequired,
        height: extendedPropTypes.cssSizeRequired,
        padding: extendedPropTypes.cssSizeRequired,
        margin: extendedPropTypes.cssSizeRequired,
    }),
};

LayoutList.defaultProps = {
    ordered: false,
    listItems: [],
    scrollable: true,
    listStyles: {
        flexDirection: "column",
        gap: "6px",
        width: "100%",
        height: "auto",
        padding: "6px",
        margin: "0px",
    },
};

export default LayoutList;
