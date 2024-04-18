import React from "react";
import styles from "./index.module.css";

type SkeletonTypes = {
    style?: React.CSSProperties;
};

function Skeleton({ style }: SkeletonTypes) {
    return <div style={style} className={styles["container"]}></div>;
}

export default Skeleton;
