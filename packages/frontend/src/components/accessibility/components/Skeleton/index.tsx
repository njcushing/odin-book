import React, { ReactNode } from "react";
import styles from "./index.module.css";

type SkeletonTypes = {
    waiting?: boolean;
    style?: React.CSSProperties;
    children?: ReactNode;
};

function Skeleton({ waiting = false, style, children }: SkeletonTypes) {
    return waiting ? (
        <div style={style} className={children ? styles["parent"] : styles["container"]}>
            {children}
        </div>
    ) : (
        children
    );
}

export default Skeleton;
