import Buttons from "@/components/buttons";
import formatBytes from "@/utils/formatBytes";
import React from "react";
import styles from "./index.module.css";

type ImageButtonTypes = {
    file: File;
    label?: string;
    onClickHandler: ((event: React.MouseEvent<HTMLButtonElement>) => void) | null;
};

function ImageButton({ file, label = "image button", onClickHandler = null }: ImageButtonTypes) {
    return (
        <div className={styles["container"]} aria-label={label}>
            <div className={styles["file-info"]}>
                <p className={styles["image-file-name"]}>{file.name}</p>
                <p className={styles["image-file-size"]}>{formatBytes(file.size, 2)}</p>
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

export default ImageButton;
