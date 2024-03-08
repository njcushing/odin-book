import { useState } from "react";
import Buttons from "@/components/buttons";
import { v4 as uuidv4 } from "uuid";
import * as extendedTypes from "@shared/utils/extendedTypes";
import Inputs from "../..";
import * as Types from "../../types";
import * as validation from "../../utils/validation";
import getSizes from "../../utils/getSizes";
import styles from "./index.module.css";

type Files = {
    [key: string]: {
        data: extendedTypes.TypedArray;
        file: File;
    };
};

type Custom = {
    accept?: string;
    multiple?: boolean;
    maximumAmount?: number;
    description?: string;
    buttonSymbol?: string;
    onUpdateHandler?: ((files: Files) => void) | null;
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
                            const [event, file] = uploads[i];
                            if (!file.type.match(accept)) break;
                            if (
                                /* Ensure file being loaded is of type 'ArrayBufferLike' */
                                event.target &&
                                event.target.result &&
                                typeof event.target.result !== "string"
                            ) {
                                const fileArray = new Uint8Array(event.target.result);
                                const valid = validation.validate(
                                    fileArray,
                                    validator || null,
                                    false,
                                );
                                if (!valid.status) {
                                    setError(valid.message || "Something went wrong.");
                                } else {
                                    const key = uuidv4();
                                    newFiles[key] = {
                                        data: fileArray,
                                        file,
                                    };
                                }
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
                <p className={styles["no-files-message"]} style={{ ...noMessageSizes }}>
                    No files selected.
                </p>
            )}
            {!disabled && currentErrorMessage.length > 0 ? (
                <Inputs.Error text={currentErrorMessage} size={size} />
            ) : null}
        </div>
    );
}

export default File;
