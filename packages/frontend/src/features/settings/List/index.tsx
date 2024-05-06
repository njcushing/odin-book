import React from "react";
import { TFieldUpdater } from "@/features/settings/FieldUpdater";
import styles from "./index.module.css";

export type TList = {
    title: string;
    fields: React.ReactElement<TFieldUpdater>[];
};

function List({ title, fields }: TList) {
    return (
        <div className={styles["container"]}>
            <h3 className={styles["title"]}>{title}</h3>
            {fields.map((field) => {
                return (
                    <div
                        className={styles["field-container"]}
                        key={field.props.field.props.fieldName}
                    >
                        <div className={styles["separator"]}></div>
                        {field}
                    </div>
                );
            })}
        </div>
    );
}

export default List;
