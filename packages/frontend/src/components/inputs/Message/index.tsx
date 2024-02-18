import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Buttons from "@/components/buttons";
import validateField from "@/utils/validateField";
import formatBytes from "@/utils/formatBytes";
import styles from "./index.module.css";

type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

type Images = {
    [key: string]: {
        image: number[];
        file: File;
    };
};

type Validator<T> = {
    func: (
        value: T,
        messageType: "front" | "back",
        ...args: unknown[]
    ) => {
        status: boolean;
        message: string | null;
    };
    args?: unknown[];
} | null;

type Submitter<textT, imagesT> = {
    func: (
        text: textT,
        images: imagesT,
        ...args: unknown[]
    ) => {
        status: boolean;
        message: string | null;
        data: object | null;
    };
    args?: unknown[];
} | null;

type MessageTypes = {
    text?: string;
    placeholder?: string;
    textValidator?: Validator<string>;
    imageValidator?: Validator<number[]>;
    submitHandler?: Submitter<string, Images>;
    submissionErrors?: string[];
    sending?: boolean;
};

function Message({
    text = "",
    placeholder = "",
    textValidator = null,
    imageValidator = null,
    submitHandler = null,
    submissionErrors = [],
    sending = false,
}: MessageTypes) {
    const [textareaContent, setTextareaContent]: [string, Setter<string>] = useState<string>(text);
    const [textError, setTextError]: [string, Setter<string>] = useState<string>("");
    const [images, setImages]: [Images, Setter<Images>] = useState<Images>({});
    const [imageError, setImageError]: [string, Setter<string>] = useState<string>("");

    const createImageButton = (key: string, file: { name: string }) => {
        return (
            <li className={styles["image-button"]} aria-label="image to load" key={key}>
                <div className={styles["file-info"]}>
                    <p className={styles["image-file-name"]}>{file.name}</p>
                    <p className={styles["image-file-size"]}>{formatBytes(file.size, 2)}</p>
                </div>
                <Buttons.Basic
                    text=""
                    symbol="cancel"
                    onClickHandler={() => {
                        const newImages = { ...images };
                        delete newImages[key];
                        setImages(newImages);
                    }}
                    otherStyles={{ fontSize: "1.0rem", padding: "0.2rem" }}
                />
            </li>
        );
    };

    return (
        <>
            <div className={styles["message-box"]} aria-label="message-box">
                <div className={styles["input-container"]}>
                    <textarea
                        className={styles["message-textarea"]}
                        aria-label="message-textarea"
                        id="text"
                        defaultValue={textareaContent}
                        placeholder={placeholder}
                        required
                        style={{
                            resize: "none",
                        }}
                        onChange={(e) => {
                            const valid = validateField(
                                e.target.value,
                                textValidator || null,
                                false,
                            );
                            if (!valid.status)
                                setTextError(valid.message || "Something went wrong.");
                            setTextareaContent(e.target.value);
                        }}
                        disabled={sending}
                    ></textarea>
                    {Object.keys(images).length > 0 ? (
                        <ul className={styles["image-buttons-list"]}>
                            {Object.keys(images).map((key) =>
                                createImageButton(key, images[key].file),
                            )}
                        </ul>
                    ) : null}
                </div>
                <div className={styles["send-options-container"]}>
                    <Buttons.Upload
                        accept="image.*"
                        multiple
                        button={{
                            text: "",
                            symbol: "image",
                            palette: "primary",
                            style: { shape: "rounded" },
                        }}
                        onUploadHandler={(uploads: [ProgressEvent<FileReader>, File][]) => {
                            const newImages: Images = {};
                            uploads.forEach((upload) => {
                                const [event, file] = upload;
                                if (!file.type.match("image.*")) return;
                                if (
                                    /* Ensure file being loaded is of type 'ArrayBufferLike' */
                                    event.target &&
                                    event.target.result &&
                                    typeof event.target.result !== "string"
                                ) {
                                    const imgArray = Array.from(
                                        new Uint8Array(event.target.result),
                                    );
                                    const valid = validateField(
                                        imgArray,
                                        imageValidator || null,
                                        false,
                                    );
                                    if (!valid.status) {
                                        setImageError(valid.message || "Something went wrong.");
                                    } else {
                                        const key = uuidv4();
                                        newImages[key] = {
                                            image: imgArray,
                                            file,
                                        };
                                    }
                                }
                            });
                            setImages({ ...images, ...newImages });
                        }}
                    />
                    <Buttons.Basic
                        type="submit"
                        text="Send"
                        onSubmitHandler={() => {
                            if (submitHandler) {
                                submitHandler.func(textareaContent, images, submitHandler.args);
                            }
                        }}
                        palette="blue"
                        disabled={sending}
                    />
                </div>
            </div>
            {textError.length > 0 ? <p className={styles["error"]}>{textError}</p> : null}
            {imageError.length > 0 ? <p className={styles["error"]}>{imageError}</p> : null}
            {submissionErrors.length > 0 ? (
                <ul className={styles["submission-errors"]} aria-label="message-submission-errors">
                    {submissionErrors.map((error) => {
                        return (
                            <li
                                className={styles["error"]}
                                aria-label="message-submission-error"
                                key={uuidv4()}
                            >
                                {error}
                            </li>
                        );
                    })}
                </ul>
            ) : null}
        </>
    );
}

export default Message;
