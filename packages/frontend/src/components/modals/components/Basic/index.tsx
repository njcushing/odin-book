import React from "react";
import Buttons from "@/components/buttons";
import styles from "./index.module.css";

type BasicTypes = {
    onCloseClickHandler?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | null;
    unblockPointerEvents?: boolean;
    style?: React.CSSProperties;
};

function Basic({
    onCloseClickHandler = null,
    unblockPointerEvents = false,
    style = {},
}: BasicTypes) {
    return (
        <div
            className={styles["container"]}
            style={{ pointerEvents: unblockPointerEvents ? "none" : "all" }}
        >
            <div className={styles["modal"]} style={{ ...style }}>
                <div className={styles["close-button-container"]}>
                    <Buttons.Basic
                        type="button"
                        text=""
                        symbol="close"
                        label="close"
                        onClickHandler={onCloseClickHandler}
                        style={{ shape: "rounded" }}
                        palette="primary"
                        otherStyles={{ fontSize: "1.2rem", padding: "0.3rem" }}
                    />
                </div>
            </div>
        </div>
    );
}

export default Basic;
