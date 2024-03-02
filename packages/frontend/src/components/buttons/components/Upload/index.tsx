import Buttons from "../..";
import * as Types from "../../types";
import styles from "./index.module.css";

const buttonDefaultProps: Types.Basic = {
    text: "",
    symbol: "",
    label: "",
    disabled: false,
    palette: "primary",
    animation: "rigid",
    style: { shape: "sharp" },
    otherStyles: { fontSize: "1.25rem" },
};

type UploadTypes = {
    labelText?: string;
    fieldId?: string;
    fieldName?: string;
    accept?: string;
    multiple?: boolean;
    button?: Types.Basic;
    onUploadHandler?: ((uploads: [ProgressEvent<FileReader>, File][]) => void) | null;
};

function Upload({
    labelText,
    fieldId,
    fieldName,
    accept = "*",
    multiple = false,
    button = { ...buttonDefaultProps },
    onUploadHandler = null,
}: UploadTypes) {
    return (
        <Buttons.Basic
            type="button"
            text={button.text || buttonDefaultProps.text}
            symbol={button.symbol || buttonDefaultProps.symbol}
            label={button.label || buttonDefaultProps.label}
            disabled={button.disabled || buttonDefaultProps.disabled}
            allowDefaultEventHandling
            palette={button.palette || buttonDefaultProps.palette}
            animation={button.animation || buttonDefaultProps.animation}
            style={button.style || buttonDefaultProps.style}
            otherStyles={button.otherStyles || buttonDefaultProps.otherStyles}
        >
            <label
                className={styles["label"]}
                htmlFor={fieldId}
                aria-label="upload"
                data-disabled={!!(button.disabled || buttonDefaultProps.disabled)}
                style={{
                    borderRadius: button.style && button.style.shape === "sharp" ? "0px" : "9999px",
                }}
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
