import Buttons from "@/components/buttons";
import formatBytes from "@/utils/formatBytes";
import React from "react";
import * as Types from "../../types";
import getSizes from "../../utils/getSizes";
import styles from "./index.module.css";

type FileButtonTypes = Types.Sizes & {
    file: File;
    label?: string;
    onClickHandler: ((event: React.MouseEvent<HTMLButtonElement>) => void) | null;
};

function FileButton({
    file,
    label = "file button",
    onClickHandler = null,
    size = "m",
}: FileButtonTypes) {
    const fileNameSizes = getSizes(size, "text");
    const fileSizeSizes = getSizes(size, "description");

    return (
        <div className={styles["container"]} aria-label={label}>
            <div className={styles["file-info"]}>
                <p className={styles["file-name"]} style={{ ...fileNameSizes }}>
                    {file.name}
                </p>
                <p className={styles["file-size"]} style={{ ...fileSizeSizes }}>
                    {formatBytes(file.size, 2)}
                </p>
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
