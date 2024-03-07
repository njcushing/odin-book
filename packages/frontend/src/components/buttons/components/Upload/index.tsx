import Buttons from "../..";
import * as Types from "../../types";
import styles from "./index.module.css";

const buttonDefaultProps: Types.Basic = {
    type: "button",
    text: "",
    symbol: "",
    label: "",
    disabled: false,
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
    button = { ...buttonDefaultProps },
    onUploadHandler = null,
}: Types.Upload) {
    const buttonProps = { ...buttonDefaultProps, ...button };

    return (
        <Buttons.Basic {...buttonProps}>
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
                    disabled={button.disabled || buttonDefaultProps.disabled}
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
        </Buttons.Basic>
    );
}

export default Upload;
