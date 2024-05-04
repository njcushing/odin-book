import React, { useState, useEffect } from "react";
import * as useAsync from "@/hooks/useAsync";
import Modals from "@/components/modals";
import Buttons from "@/components/buttons";
import Images from "@/components/images";
import mongoose from "mongoose";
import * as extendedTypes from "@shared/utils/extendedTypes";
import validation from "@shared/validation";
import validateUploadedFile from "@/components/inputs/components/File/utils/validateUploadedFile";
import { v4 as uuidv4 } from "uuid";
import updateChatImage, { Params, Body, Response } from "./utils/updateChatImage";
import styles from "./index.module.css";

type Images = {
    [key: string]: {
        data: extendedTypes.TypedArray;
        file: File;
    };
};

type UpdateImageTypes = {
    _id: mongoose.Types.ObjectId;
    defaultImageURL?: string;
    onCloseClickHandler?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | null;
    onSuccessHandler?: (() => unknown) | null;
};

function UpdateImage({
    _id,
    defaultImageURL = "",
    onCloseClickHandler = null,
    onSuccessHandler = null,
}: UpdateImageTypes) {
    const [images, setImages] = useState<Images | null>(null);

    const [waiting, setWaiting] = useState<boolean>(false);

    const [response, setParams, setAttempting, updatingImage] = useAsync.PUT<
        Params,
        Body,
        Response
    >(
        {
            func: updateChatImage,
            parameters: [{ params: { chatId: _id } }, null],
        },
        false,
    );
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        if (response) {
            if (response.status >= 400 && response.message && response.message.length > 0) {
                setErrorMessage(response.message);
            } else {
                setErrorMessage("");
            }
        }
    }, [response]);

    useEffect(() => {
        if (response && response.status < 400) {
            if (onSuccessHandler) onSuccessHandler();
            PubSub.publish("chat-image-update-successful", { _id, image: response.data });
        }
    }, [response, _id, onSuccessHandler]);

    useEffect(() => {
        setWaiting(updatingImage);
    }, [updatingImage]);

    const imageSrc =
        images && Object.keys(images).length === 1 ? images[Object.keys(images)[0]].data : null;

    return (
        <Modals.Basic onCloseClickHandler={onCloseClickHandler} key="h">
            <div className={styles["container"]} key="d">
                <h2 className={styles["title"]} key="e">
                    Set a New Chat Image
                </h2>
                <div className={styles["content"]} key="f">
                    <Images.Profile src={imageSrc || defaultImageURL} sizePx={144} key="a" />
                    <Buttons.Upload
                        labelText=""
                        fieldId="chat-image"
                        fieldName="image"
                        accept="image.*"
                        disabled={waiting}
                        button={{
                            text: "Change",
                            palette: "blue",
                            style: { shape: "rounded" },
                            otherStyles: { padding: "0.2rem 0.6rem" },
                        }}
                        onUploadHandler={(uploads: [ProgressEvent<FileReader>, File][]) => {
                            const newFiles: Images = {};
                            for (let i = 0; i < uploads.length; i++) {
                                if (i >= 1) break;
                                const [status, message, data] = validateUploadedFile(
                                    uploads[i],
                                    "image.*",
                                    { func: validation.chat.imageArray },
                                );
                                if (!status) {
                                    setErrorMessage(message);
                                } else if (data) {
                                    const key = uuidv4();
                                    newFiles[key] = data;
                                }
                            }
                            setImages(newFiles);
                        }}
                        key="b"
                    />
                </div>
                {errorMessage.length > 0 ? (
                    <p className={styles["error-message"]}>{errorMessage}</p>
                ) : null}
                <div className={styles["create-button-container"]}>
                    <Buttons.Basic
                        text="Confirm"
                        palette="green"
                        onClickHandler={() => {
                            if (images && Object.keys(images).length > 0) {
                                const image = images[Object.keys(images)[0]].data;
                                setErrorMessage("");
                                setParams([{ params: { chatId: _id }, body: { image } }, null]);
                                setAttempting(true);
                            }
                        }}
                        disabled={
                            waiting ||
                            (images ? Object.keys(images).length !== 1 : true) ||
                            errorMessage.length > 0
                        }
                        otherStyles={{ fontSize: "1.2rem" }}
                        key="c"
                    />
                </div>
            </div>
        </Modals.Basic>
    );
}

export default UpdateImage;
