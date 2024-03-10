import { useState } from "react";
import Buttons from "@/components/buttons";
import { v4 as uuidv4 } from "uuid";
import * as extendedTypes from "@shared/utils/extendedTypes";
import Inputs from "../..";
import * as Types from "../../types";
import validateUploadedFile from "./utils/validateUploadedFile";
import getSizes from "../../utils/getSizes";
import styles from "./index.module.css";

export type FileInfoTypes = {
    data: extendedTypes.TypedArray;
    file: File;
};

type Files = {
    [key: string]: FileInfoTypes;
};

type Custom = {
    accept?: string;
    multiple?: boolean;
    maximumAmount?: number;
    description?: string;
    buttonSymbol?: string;
    onUpdateHandler?: ((files: Files) => void) | null;
    displayNoFilesSelectedMessage?: boolean;
};

export type FileTypes = Types.Base<Files> &
    Types.Error &
    Types.Validator<extendedTypes.TypedArray> &
    Types.Sizes &
    Custom;

function File({
    labelText,
    fieldId,
    fieldName,
    initialValue,
    disabled = false,
    required = false,
    errorMessage = "",
    validator = null,
    size = "s",
    accept = "*",
    multiple = false,
    maximumAmount,
    description = "",
    buttonSymbol = "attach_file",
    onUpdateHandler = null,
    displayNoFilesSelectedMessage = false,
}: FileTypes) {
    const [files, setFiles] = useState<Files>(initialValue || {});
    const [error, setError] = useState<string>("");

    const sizes = getSizes(size, "input");
    const noMessageSizes = getSizes(size, "text");

    const createFileButton = (key: string, file: File) => {
        return (
            <Inputs.FileButton
                file={file}
                label="file button"
                onClickHandler={() => {
                    const newFiles = { ...files };
                    delete newFiles[key];
                    setFiles(newFiles);
                    if (onUpdateHandler) onUpdateHandler(newFiles);
                }}
                size={size}
                key={key}
            />
        );
    };

    let currentErrorMessage = "";
    if (errorMessage && errorMessage.length > 0) {
        currentErrorMessage = errorMessage;
    } else if (error && error.length > 0) {
        currentErrorMessage = error;
    }

    return (
        <div className={styles["wrapper"]}>
            <div className={`truncate-ellipsis ${styles["label-and-upload-button-container"]}`}>
                <Inputs.Label
                    labelText={labelText}
                    fieldId={fieldId}
                    required={required}
                    size={size}
                />
                <Buttons.Upload
                    labelText=""
                    fieldId={fieldId}
                    fieldName={fieldName}
                    accept={accept}
                    multiple={multiple}
                    button={{
                        text: "",
                        symbol: buttonSymbol,
                        disabled:
                            (maximumAmount && Object.keys(files).length >= maximumAmount) ||
                            disabled,
                        palette: "primary",
                        style: { shape: "rounded" },
                        otherStyles: { ...sizes, padding: "0.6rem" },
                    }}
                    onUploadHandler={(uploads: [ProgressEvent<FileReader>, File][]) => {
                        const currentQuantity = Object.keys(files).length;
                        const newFiles: Files = {};
                        for (let i = 0; i < uploads.length; i++) {
                            if (maximumAmount && currentQuantity + i >= maximumAmount) break;
                            const [status, message, data] = validateUploadedFile(
                                uploads[i],
                                accept,
                                validator,
                            );
                            if (!status) {
                                setError(message);
                            } else if (data) {
                                const key = uuidv4();
                                newFiles[key] = data;
                            }
                        }
                        setFiles({ ...files, ...newFiles });
                        if (onUpdateHandler) onUpdateHandler({ ...files, ...newFiles });
                    }}
                />
            </div>
            <Inputs.Description text={description} size={size} />
            {Object.keys(files).length > 0 ? (
                <div className={styles["input-container"]}>
                    {Object.keys(files).length > 0 ? (
                        <ul className={styles["file-buttons-list"]}>
                            {Object.keys(files).map((key) =>
                                createFileButton(key, files[key].file),
                            )}
                        </ul>
                    ) : null}
                </div>
            ) : (
                displayNoFilesSelectedMessage && (
                    <p className={styles["no-files-message"]} style={{ ...noMessageSizes }}>
                        No files selected.
                    </p>
                )
            )}
            {!disabled && currentErrorMessage.length > 0 ? (
                <Inputs.Error text={currentErrorMessage} size={size} />
            ) : null}
        </div>
    );
}

export default File;
