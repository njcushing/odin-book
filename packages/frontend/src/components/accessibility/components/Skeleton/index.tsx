import React, { ReactNode } from "react";
import styles from "./index.module.css";

type SkeletonTypes = {
    style?: React.CSSProperties;
    children?: ReactNode;
};

function Skeleton({ style, children }: SkeletonTypes) {
    return (
        <div style={style} className={children ? styles["parent"] : styles["container"]}>
            {children}
        </div>
    );
}

export default Skeleton;
