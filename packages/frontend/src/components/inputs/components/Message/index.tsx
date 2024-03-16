import React, { useState } from "react";
import Buttons from "@/components/buttons";
import { v4 as uuidv4 } from "uuid";
import * as extendedTypes from "@shared/utils/extendedTypes";
import Inputs from "../..";
import * as validation from "../../utils/validation";
import styles from "./index.module.css";

type Images = {
    [key: string]: {
        data: extendedTypes.TypedArray;
        file: File;
    };
};

export type MessageTypes = {
    initialText?: string;
    textFieldId: string;
    textFieldName: string;
    placeholder?: string;
    initialImages?: Images;
    imageFieldId: string;
    imageFieldName: string;
    textValidator?: validation.Validator<string>;
    imageValidator?: validation.Validator<extendedTypes.TypedArray>;
    onSendHandler?: ((text: string, images: Images) => void) | null;
    submissionErrors?: string[];
    sending?: boolean;
};

function Message({
    initialText = "",
    textFieldId,
    textFieldName,
    placeholder = "",
    initialImages = {},
    imageFieldId,
    imageFieldName,
    textValidator = null,
    imageValidator = null,
    onSendHandler = null,
    submissionErrors = [],
    sending = false,
}: MessageTypes) {
    const [text, setText] = useState<string>(initialText);
    const [images, setImages] = useState<Images>(initialImages);

    return (
        <div className={styles["container"]}>
            <div className={styles["message-box"]} aria-label="message-box">
                <div className={styles["input-container"]}>
                    <div className={styles["textarea-container"]}>
                        <Inputs.TextArea
                            labelText=""
                            fieldId={textFieldId}
                            fieldName={textFieldName}
                            initialValue={text}
                            validator={textValidator}
                            onChangeHandler={(e) => {
                                setText(e.target.value);
                            }}
                            maxLength={500}
                            placeholder={placeholder}
                        />
                    </div>
                    <div className={styles["file-container"]}>
                        <Inputs.File
                            labelText=""
                            fieldId={imageFieldId}
                            fieldName={imageFieldName}
                            initialValue={images}
                            onUpdateHandler={(data) => setImages(data)}
                            validator={imageValidator}
                            maximumAmount={4}
                            accept="image.*"
                            multiple
                            buttonSymbol="image"
                        />
                    </div>
                </div>
                <div className={styles["send-options-container"]}>
                    <Buttons.Basic
                        type="submit"
                        text="Send"
                        onClickHandler={() => {
                            if (onSendHandler) onSendHandler(text, images);
                        }}
                        palette="blue"
                        disabled={sending}
                    />
                </div>
            </div>
            {submissionErrors.length > 0 ? (
                <>
                    <p className={styles["submission-errors-title"]}>Submission Errors:</p>
                    <ul className={styles["errors-list"]} aria-label="message submission errors">
                        {submissionErrors.map((error) => {
                            return (
                                <li
                                    className={styles["error"]}
                                    aria-label="message submission error"
                                    key={uuidv4()}
                                >
                                    {error}
                                </li>
                            );
                        })}
                    </ul>
                </>
            ) : null}
        </div>
    );
}

export default Message;
