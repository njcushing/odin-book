import React, { useState } from "react";
import Modals from "@/components/modals";
import Inputs from "@/components/inputs";
import Buttons from "@/components/buttons";
import * as extendedTypes from "@shared/utils/extendedTypes";
import validate from "@shared/validation";
import { v4 as uuidv4 } from "uuid";
import Posts from "..";
import styles from "./index.module.css";

type Images = {
    [key: string]: {
        data: extendedTypes.TypedArray;
        file: File;
    };
};

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

type CreateTypes = {
    defaultText?: string;
    placeholder?: string;
    defaultImages?: Images;
    submitHandler?: Submitter<string, Images>;
    submissionErrors?: string[];
    onCloseClickHandler?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | null;
};

function Create({
    defaultText = "",
    placeholder = "",
    defaultImages = {},
    submitHandler = null,
    submissionErrors = [],
    onCloseClickHandler = null,
}: CreateTypes) {
    const [text, setText] = useState<string>(defaultText);
    const [images, setImages] = useState<Images>(defaultImages);

    return (
        <Modals.Basic onCloseClickHandler={onCloseClickHandler}>
            <div className={styles["container"]}>
                <h2 className={styles["title"]}>Create a New Post</h2>
                <div>
                    <div className={styles["input-container"]}>
                        <Inputs.TextArea
                            labelText="Text"
                            fieldId="text"
                            fieldName="text"
                            validator={{ func: validate.post.text }}
                            onChangeHandler={(e) => {
                                setText(e.target.value);
                            }}
                            maxLength={500}
                            counter
                            placeholder={placeholder}
                        />
                        <Inputs.File
                            labelText="Images"
                            fieldId="test"
                            fieldName="test"
                            onUpdateHandler={(data) => setImages(data)}
                            validator={{ func: validate.post.image }}
                            maximumAmount={4}
                            accept="image.*"
                            multiple
                            buttonSymbol="image"
                        />
                    </div>
                    {submissionErrors.length > 0 ? (
                        <div className={styles["errors-list"]}>
                            <p className={styles["submission-errors-title"]}>Submission Errors:</p>
                            <ul
                                className={styles["submission-errors"]}
                                aria-label="message-submission-errors"
                            >
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
                        </div>
                    ) : null}
                </div>
                <div className={styles["content-container"]}>
                    <Posts.Post
                        overridePostData={{
                            _id: "",
                            author: {
                                _id: "",
                                accountTag: "JohnSmith84",
                                preferences: {
                                    displayName: "John Smith",
                                    profileImage: { src: new Uint8Array([]), alt: "" },
                                },
                                status: null,
                            },
                            content: {
                                text,
                                images: Object.keys(images).map((key) => {
                                    return {
                                        src: images[key].data,
                                        alt: "",
                                        key,
                                    };
                                }),
                            },
                            likes: [],
                            likesQuantity: 0,
                            replies: [],
                            repliesQuantity: 0,
                        }}
                        previewMode
                        canReply
                    />
                </div>
                <div className={styles["post-button-container"]}>
                    <Buttons.Basic
                        text="Post"
                        palette="green"
                        onClickHandler={() => {
                            if (submitHandler) {
                                submitHandler.func(text, images, submitHandler.args);
                            }
                        }}
                        otherStyles={{ fontSize: "1.2rem" }}
                    />
                </div>
            </div>
        </Modals.Basic>
    );
}

export default Create;
