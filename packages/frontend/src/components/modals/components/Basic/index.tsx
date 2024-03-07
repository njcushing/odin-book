import React from "react";
import Buttons from "@/components/buttons";
import styles from "./index.module.css";

type BasicTypes = {
    onCloseClickHandler?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | null;
    unblockPointerEvents?: boolean;
    style?: React.CSSProperties;
    children?: React.ReactNode | null;
};

function Basic({
    onCloseClickHandler = null,
    unblockPointerEvents = false,
    style = {},
    children = null,
}: BasicTypes) {
    return (
        <div
            className={styles["wrapper"]}
            style={{ pointerEvents: unblockPointerEvents ? "none" : "all" }}
        >
            <div className={styles["container"]}>
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
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Basic;
