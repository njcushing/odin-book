import React, { useState, useEffect } from "react";
import Modals from "@/components/modals";
import Inputs from "@/components/inputs";
import Buttons from "@/components/buttons";
import * as extendedTypes from "@shared/utils/extendedTypes";
import validate from "@shared/validation";
import * as useAsync from "@/hooks/useAsync";
import mongoose from "mongoose";
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
    onCloseClickHandler?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | null;
};

function Create({
    defaultText = "",
    placeholder = "",
    defaultImages = {},
    onCloseClickHandler = null,
}: CreateTypes) {
    const [text, setText] = useState<string>(defaultText);
    const [images, setImages] = useState<Images>(defaultImages);

    const [response, setParams, setAttempting] = useAsync.POST<null, Body, Response>(
        { func: createPost },
        false,
    );
    const [errorMessage, setErrorMessage] = useState<string>("");

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
                            validator={{ func: validate.post.imageArray }}
                            maximumAmount={4}
                            accept="image.*"
                            multiple
                            buttonSymbol="image"
                        />
                    </div>
                </div>
                {errorMessage.length > 0 ? (
                    <p className={styles["error-message"]}>{errorMessage}</p>
                ) : null}
                <div className={styles["content-container"]}>
                    <Posts.Post
                        overridePostData={{
                            _id: new mongoose.Types.ObjectId(),
                            author: {
                                _id: new mongoose.Types.ObjectId(),
                                accountTag: "JohnSmith84",
                                preferences: {
                                    displayName: "John Smith",
                                    profileImage: {
                                        _id: new mongoose.Types.ObjectId(),
                                        url: new Uint8Array([]),
                                        alt: "",
                                    },
                                },
                            },
                            text,
                            images: Object.keys(images).map((key) => {
                                return {
                                    _id: new mongoose.Types.ObjectId(),
                                    url: images[key].data,
                                    alt: "",
                                };
                            }),
                            replyingTo: null,
                            createdAt: Date.now().toString(),
                            likesCount: 0,
                            repliesCount: 0,
                            likedByUser: false,
                        }}
                        previewMode
                    />
                </div>
                <div className={styles["post-button-container"]}>
                    <Buttons.Basic
                        text="Post"
                        palette="green"
                        onClickHandler={() => {
                            if (text.length === 0 && Object.keys(images).length === 0) {
                                setErrorMessage(
                                    "Your post must not be empty; there must either be some text, or images.",
                                );
                            } else {
                                setErrorMessage("");
                                setParams([
                                    {
                                        body: {
                                            text,
                                            images: Object.keys(images).map(
                                                (key) => images[key].data,
                                            ),
                                        },
                                    },
                                    null,
                                ]);
                                setAttempting(true);
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
