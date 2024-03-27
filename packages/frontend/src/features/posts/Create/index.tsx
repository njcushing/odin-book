import React, { useState, useEffect } from "react";
import Modals from "@/components/modals";
import Inputs from "@/components/inputs";
import Buttons from "@/components/buttons";
import * as extendedTypes from "@shared/utils/extendedTypes";
import validate from "@shared/validation";
import { v4 as uuidv4 } from "uuid";
import * as useAsync from "@/hooks/useAsync";
import createPost, { Body, Response } from "./utils/createPost";
import Posts from "..";
import styles from "./index.module.css";

type Images = {
    [key: string]: {
        data: extendedTypes.TypedArray;
        file: File;
    };
};

type CreateTypes = {
    defaultText?: string;
    placeholder?: string;
    defaultImages?: Images;
    submissionErrors?: string[];
    onCloseClickHandler?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | null;
};

function Create({
    defaultText = "",
    placeholder = "",
    defaultImages = {},
    submissionErrors = [],
    onCloseClickHandler = null,
}: CreateTypes) {
    const [text, setText] = useState<string>(defaultText);
    const [images, setImages] = useState<Images>(defaultImages);

    const [response, setParams, setAttempting] = useAsync.POST<Body, Response>(
        { func: createPost },
        false,
    );
    const [errorMessage, setErrorMessage] = useState<string>("");

    if (response && response.status === 401) window.location.assign("/");

    useEffect(() => {
        if (response && response.status >= 400 && response.message && response.message.length > 0) {
            setErrorMessage(response.message);
        }
    }, [response]);

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
                {errorMessage.length > 0 ? (
                    <p className={styles["error-message"]}>{errorMessage}</p>
                ) : null}
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
                            setParams([
                                {
                                    body: {
                                        text,
                                        images: Object.keys(images).map((key) => images[key].data),
                                    },
                                },
                                null,
                            ]);
                            setAttempting(true);
                        }}
                        otherStyles={{ fontSize: "1.2rem" }}
                    />
                </div>
            </div>
        </Modals.Basic>
    );
}

export default Create;
