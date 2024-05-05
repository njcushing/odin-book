import React from "react";
import styles from "./index.module.css";

type TWaitingWheel = {
    containerStyles?: React.CSSProperties;
    wheelStyles?: React.CSSProperties;
};

function WaitingWheel({ containerStyles = {}, wheelStyles = {} }: TWaitingWheel) {
    return (
        <div className={styles["container"]} style={containerStyles}>
            <div className={styles["wheel"]} style={wheelStyles}></div>
        </div>
    );
}

export default WaitingWheel;
