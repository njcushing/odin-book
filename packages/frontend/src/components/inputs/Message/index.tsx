import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Buttons from "@/components/buttons";
import styles from "./index.module.css";

type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

type ImagesArray = number[][];

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
    submitHandler?: Submitter<string, ImagesArray>;
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
    const [images, setImages]: [ImagesArray, Setter<ImagesArray>] = useState<ImagesArray>([]);
    const [imageError, setImageError]: [string, Setter<string>] = useState<string>("");

    return (
        <>
            <div className={styles["message-box"]} aria-label="message-box">
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
                        let valid = true;
                        let error = "";
                        if (textValidator && textValidator.func) {
                            const result = textValidator.func(e.target.value, "front");
                            if (!result.status) {
                                valid = false;
                                error = result.message || "";
                            }
                        }
                        if (!valid) {
                            setTextError(error);
                        }
                        setTextareaContent(e.target.value);
                    }}
                    disabled={sending}
                ></textarea>
                <div className={styles["send-options-container"]}>
                    <Buttons.Upload
                        accept="image/*"
                        multiple={false}
                        button={{
                            text: "",
                            symbol: "image",
                            palette: "primary",
                            style: { shape: "rounded" },
                        }}
                        onUploadHandler={(e) => {
                            if (
                                /* Ensure file being loaded is of type 'ArrayBufferLike' */
                                e.target &&
                                e.target.result &&
                                typeof e.target.result !== "string"
                            ) {
                                const imgArray = Array.from(new Uint8Array(e.target.result));
                                let valid = true;
                                let error = "";
                                if (imageValidator && imageValidator.func) {
                                    const result = imageValidator.func(imgArray, "front");
                                    if (!result.status) {
                                        valid = false;
                                        error = result.message || "";
                                    }
                                }
                                if (valid) {
                                    setImages([...images, imgArray]);
                                } else {
                                    setImageError(error);
                                }
                            }
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
