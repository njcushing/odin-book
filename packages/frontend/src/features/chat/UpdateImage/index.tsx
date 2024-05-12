import React, { useState, useEffect } from "react";
import * as useAsync from "@/hooks/useAsync";
import Modals from "@/components/modals";
import Buttons from "@/components/buttons";
import Images from "@/components/images";
import * as extendedTypes from "@shared/utils/extendedTypes";
import validation from "@shared/validation";
import validateUploadedFile from "@/components/inputs/components/File/utils/validateUploadedFile";
import { v4 as uuidv4 } from "uuid";
import { Response as GetChatOverviewResponse } from "@/features/chat/utils/getChatOverview";
import Chat from "..";
import { ReturnTypes as extractedParticipantsInfo } from "../Active/utils/extractParticipantsInformation";
import updateChatImage, { Params, Body, Response } from "./utils/updateChatImage";
import styles from "./index.module.css";

type Images = {
    [key: string]: {
        data: extendedTypes.TypedArray;
        file: File;
    };
};

type UpdateImageTypes = {
    chatData: GetChatOverviewResponse;
    participantsInfo: extractedParticipantsInfo;
    onCloseClickHandler?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | null;
    onSuccessHandler?: (() => unknown) | null;
};

function UpdateImage({
    chatData,
    participantsInfo,
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
            parameters: [{ params: { chatId: chatData && chatData._id } }, null],
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
            PubSub.publish("chat-image-update-successful", {
                _id: chatData && chatData._id,
                image: response.data,
            });
        }
    }, [response, chatData, onSuccessHandler]);

    useEffect(() => {
        setWaiting(updatingImage);
    }, [updatingImage]);

    const imageSrc =
        images && Object.keys(images).length === 1 ? images[Object.keys(images)[0]].data : null;

    return (
        <Modals.Basic onCloseClickHandler={onCloseClickHandler}>
            <div className={styles["container"]}>
                <h2 className={styles["title"]}>Set a New Chat Image</h2>
                <div className={styles["content"]}>
                    {images ? (
                        <Images.Profile src={imageSrc || ""} sizePx={144} />
                    ) : (
                        <Chat.Image
                            chatData={chatData}
                            participantsInfo={participantsInfo}
                            style={{ width: "144px", height: "144px", border: "none" }}
                        />
                    )}
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
                                setParams([
                                    {
                                        params: { chatId: chatData && chatData._id },
                                        body: { image },
                                    },
                                    null,
                                ]);
                                setAttempting(true);
                            }
                        }}
                        disabled={
                            waiting ||
                            (images ? Object.keys(images).length !== 1 : true) ||
                            errorMessage.length > 0
                        }
                        otherStyles={{ fontSize: "1.2rem" }}
                    />
                </div>
            </div>
        </Modals.Basic>
    );
}

export default UpdateImage;
