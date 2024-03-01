import Buttons from "@/components/buttons";
import formatBytes from "@/utils/formatBytes";
import React from "react";
import styles from "./index.module.css";

type FileButtonTypes = {
    file: File;
    label?: string;
    onClickHandler: ((event: React.MouseEvent<HTMLButtonElement>) => void) | null;
};

function FileButton({ file, label = "file button", onClickHandler = null }: FileButtonTypes) {
    return (
        <div className={styles["container"]} aria-label={label}>
            <div className={styles["file-info"]}>
                <p className={styles["file-name"]}>{file.name}</p>
                <p className={styles["file-size"]}>{formatBytes(file.size, 2)}</p>
            </div>
            <Buttons.Basic
                text=""
                symbol="cancel"
                onClickHandler={onClickHandler}
                otherStyles={{ fontSize: "1.2rem", padding: "0.2rem" }}
            />
        </div>
    );
}

export default FileButton;
