import React from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "./index.module.css";

type ListProps = {
    label: string;
    ordered?: boolean;
    listItems: React.ReactNode[];
    scrollable?: boolean;
    listStyles?: React.CSSProperties;
};

function List({ label, ordered, listItems, scrollable, listStyles }: ListProps) {
    const ListComponent = ordered ? "ol" : "ul";

    const items = listItems ? listItems.map((item) => ({ item, key: uuidv4() })) : [];

    return (
        <div className={styles["wrapper"]}>
            <div className={styles["container"]}>
                <div className={styles[`${scrollable ? "scrollable-wrapper" : ""}`]}>
                    <ListComponent className={styles["list"]} aria-label={label} style={listStyles}>
                        {items.map((item) => item.item)}
                    </ListComponent>
                </div>
            </div>
        </div>
    );
}

export default List;
