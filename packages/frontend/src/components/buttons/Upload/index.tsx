import { v4 as uuidv4 } from "uuid";
import Buttons from "..";
import * as Types from "../types";
import styles from "./index.module.css";

type UploadTypes = {
    accept: string;
    multiple: boolean;
    button: Types.Basic;
    onUploadHandler?: ((event?: ProgressEvent<FileReader>) => void) | null;
};

function Upload({
    accept = "*",
    multiple = true,
    button = { text: "Upload", disabled: false },
    onUploadHandler = null,
}: UploadTypes) {
    const associationId = uuidv4();

    return (
        <Buttons.Basic
            type="button"
            text={button.text}
            symbol={button.symbol}
            label={button.label}
            disabled={button.disabled}
            palette={button.palette}
            animation={button.animation}
            style={button.style}
            otherStyles={button.otherStyles}
        >
            <label
                className={styles["label"]}
                htmlFor={associationId}
                aria-label="upload"
                style={{
                    borderRadius: button.style && button.style.shape === "sharp" ? "0px" : "9999px",
                }}
            >
                <input
                    className={styles["upload-input"]}
                    aria-label="upload"
                    type="file"
                    id={associationId}
                    accept={accept}
                    multiple={multiple}
                    disabled={button.disabled}
                    onChange={(changeEvent) => {
                        const file = new FileReader();
                        if (changeEvent.target.files && changeEvent.target.files.length > 0) {
                            file.readAsArrayBuffer(changeEvent.target.files[0]);
                            file.onloadend = (endEvent) => {
                                if (onUploadHandler) onUploadHandler(endEvent);
                            };
                        }
                    }}
                ></input>
            </label>
        </Buttons.Basic>
    );
}

export default Upload;
