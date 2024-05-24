import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "@/context/user";
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
    replyingTo?: mongoose.Types.ObjectId | undefined | null;
    onCloseClickHandler?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | null;
    onSuccessHandler?: (() => unknown) | null;
};

function Create({
    defaultText = "",
    placeholder = "",
    defaultImages = {},
    replyingTo = null,
    onCloseClickHandler = null,
    onSuccessHandler = null,
}: CreateTypes) {
    const { extract } = useContext(UserContext);

    const [text, setText] = useState<string>(defaultText);
    const [images, setImages] = useState<Images>(defaultImages);

    const [waiting, setWaiting] = useState<boolean>(false);

    const [response, setParams, setAttempting, creatingPost] = useAsync.POST<null, Body, Response>(
        { func: createPost },
        false,
    );
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        if (response && response.status >= 400 && response.message && response.message.length > 0) {
            setErrorMessage(response.message);
        }
    }, [response]);

    useEffect(() => {
        if (response && response.status < 400) {
            if (onSuccessHandler) onSuccessHandler();
            PubSub.publish("post-creation-successful", response.data);
        }
    }, [response, onSuccessHandler]);

    useEffect(() => {
        setWaiting(creatingPost);
    }, [creatingPost]);

    const authorInfo = {
        _id: (extract("_id") as mongoose.Types.ObjectId) || new mongoose.Types.ObjectId(),
        accountTag: `${extract("accountTag")}` || "User",
        preferences: {
            displayName:
                `${extract("preferences.displayName")}` || `${extract("accountTag")}` || "User",
            profileImage: (extract("preferences.profileImage") as {
                _id: mongoose.Types.ObjectId;
                url: string;
                alt: string;
            }) || {
                _id: new mongoose.Types.ObjectId(),
                url: "",
                alt: "",
            },
        },
    };

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
                            disabled={waiting}
                            maxLength={500}
                            counter
                            placeholder={placeholder}
                        />
                        <Inputs.File
                            labelText="Images"
                            fieldId="test"
                            fieldName="test"
                            disabled={waiting}
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
                            author: authorInfo,
                            text,
                            images: Object.keys(images).map((key) => {
                                return {
                                    _id: new mongoose.Types.ObjectId(),
                                    url: images[key].data,
                                    alt: "",
                                };
                            }),
                            replyingTo: null,
                            createdAt: (() => {
                                const newDate = new Date();
                                return newDate.toISOString();
                            })(),
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
                                            replyingTo,
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
                        disabled={
                            waiting || (text.length === 0 && Object.keys(images).length === 0)
                        }
                        otherStyles={{ fontSize: "1.2rem" }}
                    />
                </div>
            </div>
        </Modals.Basic>
    );
}

export default Create;
