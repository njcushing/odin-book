import Buttons from "@/components/buttons";
import formatBytes from "@/utils/formatBytes";
import React from "react";
import * as Types from "../../types";
import getSizes from "../../utils/getSizes";
import styles from "./index.module.css";

export type FileButtonTypes = Types.Sizes & {
    file: File;
    label?: string;
    onClickHandler: ((event: React.MouseEvent<HTMLButtonElement>) => void) | null;
    disabled?: boolean;
};

function FileButton({
    file,
    label = "file button",
    onClickHandler = null,
    disabled = false,
    size = "m",
}: FileButtonTypes) {
    const fileNameSizes = getSizes(size, "text");
    const fileSizeSizes = getSizes(size, "description");

    return (
        <div
            className={`${styles["container"]} ${disabled ? styles["disabled"] : ""}`}
            aria-label={label}
        >
            <div className={styles["file-info"]}>
                <p
                    className={`truncate-ellipsis ${styles["file-name"]}`}
                    style={{ ...fileNameSizes }}
                >
                    {file.name}
                </p>
                <p
                    className={`truncate-ellipsis ${styles["file-size"]}`}
                    style={{ ...fileSizeSizes }}
                >
                    {formatBytes(file.size, 2)}
                </p>
            </div>
            <Buttons.Basic
                text=""
                symbol="cancel"
                onClickHandler={onClickHandler}
                disabled={disabled}
                otherStyles={{ fontSize: "1.2rem", padding: "0.2rem" }}
            />
        </div>
    );
}

export default FileButton;
