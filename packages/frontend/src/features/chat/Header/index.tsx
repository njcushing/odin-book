import React, { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "@/context/user";
import { ChatContext } from "@/features/chat/Active";
import * as useAsync from "@/hooks/useAsync";
import Images from "@/components/images";
import Buttons from "@/components/buttons";
import determineChatName from "@/features/chat/utils/determineChatName";
import validation from "@shared/validation";
import createMultilineTextTruncateStyles from "@/utils/createMultilineTextTruncateStyles";
import mongoose from "mongoose";
import changeChatName, { Params, Body, Response } from "./utils/changeChatName";
import styles from "./index.module.css";

const buttonStyles = { fontSize: "1.1rem", padding: "0.6rem" };

type HeaderTypes = {
    overrideChatName?: string;
};

function Header({ overrideChatName }: HeaderTypes) {
    const { extract } = useContext(UserContext);
    const { chatData } = useContext(ChatContext);

    const inputRef = useRef<HTMLInputElement>(null);

    const [waiting, setWaiting] = useState<boolean>(false);
    const [editingName, setEditingName] = useState<boolean>(false);
    const [doneButtonClicked, setDoneButtonClicked] = useState<boolean>(false);
    const [nameStored, setNameStored] = useState<string>(
        overrideChatName ||
            determineChatName({
                chatData,
                ignoreActiveUser: true,
                activeUserId: `${extract("_id")}` as unknown as mongoose.Types.ObjectId,
            }),
    );

    const [chatName, setChatName] = useState<string>(
        overrideChatName ||
            determineChatName({
                chatData,
                ignoreActiveUser: true,
                activeUserId: `${extract("_id")}` as unknown as mongoose.Types.ObjectId,
            }),
    );
    const [savedResponse, setSavedResponse] = useState<{
        status: number;
        message: string | null;
        data?: null | undefined;
    } | null>(null);
    const [response, setParams, setAttempting, settingChatName] = useAsync.PUT<
        Params,
        Body,
        Response
    >(
        {
            func: changeChatName,
            parameters: [
                {
                    params: { chatId: chatData && chatData._id },
                    body: { name: chatName },
                },
                null,
            ],
        },
        false,
    );
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        if (doneButtonClicked && chatName !== nameStored) {
            const valid = validation.chat.name(chatName, "front");
            if (valid.status) {
                setParams([
                    { params: { chatId: chatData && chatData._id }, body: { name: chatName } },
                    null,
                ]);
                setAttempting(true);
            } else {
                setChatName(nameStored);
                if (inputRef.current) {
                    inputRef.current.value = nameStored;
                }
                setErrorMessage(valid.message);
            }
        }
        setDoneButtonClicked(false);
    }, [doneButtonClicked, chatName, nameStored, chatData, setParams, setAttempting]);

    useEffect(() => {
        setSavedResponse(response);
    }, [response]);

    useEffect(() => {
        if (savedResponse) {
            if (
                savedResponse.status >= 400 &&
                savedResponse.message &&
                savedResponse.message.length > 0
            ) {
                setErrorMessage(savedResponse.message);
                setChatName(nameStored);
            } else {
                setErrorMessage("");
                if (chatName.length === 0) {
                    setChatName(
                        determineChatName({
                            chatData,
                            ignoreActiveUser: true,
                            activeUserId: `${extract("_id")}` as unknown as mongoose.Types.ObjectId,
                        }),
                    );
                    setNameStored(
                        determineChatName({
                            chatData,
                            ignoreActiveUser: true,
                            activeUserId: `${extract("_id")}` as unknown as mongoose.Types.ObjectId,
                        }),
                    );
                } else {
                    setNameStored(chatName);
                }
                setEditingName(false);
            }
            setSavedResponse(null);
        }
    }, [savedResponse, chatData, chatName, nameStored, extract]);

    useEffect(() => {
        setWaiting(settingChatName);
    }, [settingChatName]);

    return (
        <div className={styles["container"]}>
            <div className={styles["chat-image-container"]}>
                <Images.Profile
                    src={chatData && chatData.image ? chatData.image.url : ""}
                    alt={chatData && chatData.image ? chatData.image.alt : ""}
                    sizePx={64}
                />
            </div>
            <div className={styles["name-container"]}>
                <div className={styles["name-container-top-row"]}>
                    {!editingName ? (
                        <>
                            <h3 className={`truncate-ellipsis ${styles["name"]}`}>{chatName}</h3>
                            <Buttons.Basic
                                text=""
                                symbol="edit"
                                label="edit chat name"
                                onClickHandler={() => setEditingName(true)}
                                disabled={waiting}
                                palette="primary"
                                otherStyles={{ ...buttonStyles }}
                            />
                        </>
                    ) : (
                        <>
                            <input
                                className={styles["edit-name"]}
                                type="text"
                                defaultValue={chatName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setChatName(e.target.value)
                                }
                                disabled={waiting}
                                // eslint-disable-next-line jsx-a11y/no-autofocus
                                autoFocus
                                ref={inputRef}
                            ></input>
                            <div className={styles["edit-chat-name-options"]}>
                                <Buttons.Basic
                                    text=""
                                    symbol="done"
                                    label="confirm new chat name"
                                    onClickHandler={() => {
                                        if (chatName === nameStored) setEditingName(false);
                                        else setDoneButtonClicked(true);
                                    }}
                                    disabled={waiting}
                                    palette="green"
                                    otherStyles={{ ...buttonStyles }}
                                />
                                <Buttons.Basic
                                    text=""
                                    symbol="close"
                                    label="cancel editing chat name"
                                    onClickHandler={() => {
                                        setChatName(nameStored);
                                        setEditingName(false);
                                    }}
                                    disabled={waiting}
                                    palette="red"
                                    otherStyles={{ ...buttonStyles }}
                                />
                            </div>
                        </>
                    )}
                </div>
                {errorMessage.length > 0 ? (
                    <p
                        className={styles["error-message"]}
                        style={{ ...createMultilineTextTruncateStyles(3) }}
                    >
                        {errorMessage}
                    </p>
                ) : null}
            </div>
            <div className={styles["options"]}>
                <Buttons.Basic
                    text=""
                    symbol="person_add"
                    label="add people"
                    onClickHandler={() => {
                        PubSub.publish("add-users-to-chat-button-click", null);
                    }}
                    palette="blue"
                    otherStyles={{ ...buttonStyles }}
                />
                <Buttons.Basic
                    text=""
                    symbol="call"
                    label="call"
                    palette="blue"
                    otherStyles={{ ...buttonStyles }}
                />
                <Buttons.Basic
                    text=""
                    symbol="videocam"
                    label="call with video"
                    palette="blue"
                    otherStyles={{ ...buttonStyles }}
                />
            </div>
        </div>
    );
}

export default Header;
