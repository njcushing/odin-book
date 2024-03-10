import Basic, { BasicTypes } from "../Basic";
import styles from "./index.module.css";

export type UploadTypes = {
    labelText?: string;
    fieldId?: string;
    fieldName?: string;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    button?: BasicTypes;
    onUploadHandler?: ((uploads: [ProgressEvent<FileReader>, File][]) => void) | null;
};

const buttonDefaultProps: BasicTypes = {
    type: "button",
    text: "",
    symbol: "",
    label: "",
    allowDefaultEventHandling: true,
    palette: "primary",
    animation: "rigid",
    style: { shape: "sharp" },
    otherStyles: { fontSize: "1.25rem" },
};

function Upload({
    labelText,
    fieldId,
    fieldName,
    accept = "*",
    multiple = false,
    disabled = false,
    button = { ...buttonDefaultProps },
    onUploadHandler = null,
}: UploadTypes) {
    const buttonProps = { ...buttonDefaultProps, ...button };

    return (
        <Basic {...buttonProps} disabled={disabled}>
            <label
                className={styles["label"]}
                htmlFor={fieldId}
                aria-label="upload"
                data-disabled={!!(button.disabled || buttonDefaultProps.disabled)}
                data-shape={buttonProps.style && buttonProps.style.shape}
            >
                {labelText}
                <input
                    className={styles["upload-input"]}
                    aria-label="upload"
                    type="file"
                    id={fieldId}
                    name={fieldName}
                    accept={accept}
                    multiple={multiple}
                    disabled={disabled}
                    onChange={async (changeEvent) => {
                        const uploads: [ProgressEvent<FileReader>, File][] = [];
                        if (changeEvent.target.files && changeEvent.target.files.length > 0) {
                            const promises = Array.from(changeEvent.target.files).map(
                                (file: File) => {
                                    return new Promise<void>((resolve) => {
                                        const reader = new FileReader();
                                        reader.onloadend = (event) => {
                                            uploads.push([event, file]);
                                            resolve();
                                        };
                                        reader.readAsArrayBuffer(file);
                                    });
                                },
                            );
                            await Promise.all(promises);
                        }
                        if (onUploadHandler) onUploadHandler(uploads);
                    }}
                ></input>
            </label>
        </Basic>
    );
}

export default Upload;
