import React, { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "@/context/user";
import { ChatContext } from "@/features/chat/Active";
import * as useAsync from "@/hooks/useAsync";
import Buttons from "@/components/buttons";
import determineChatName from "@/features/chat/utils/determineChatName";
import validation from "@shared/validation";
import createMultilineTextTruncateStyles from "@/utils/createMultilineTextTruncateStyles";
import * as extendedTypes from "@shared/utils/extendedTypes";
import changeChatName, { Params, Body, Response } from "./utils/changeChatName";
import { Response as ChatOverviewResponse } from "../utils/getChatOverview";
import styles from "./index.module.css";
import Chat from "..";

const buttonStyles = { fontSize: "1.1rem", padding: "0.6rem" };

type HeaderTypes = {
    overrideChatName?: string;
};

function Header({ overrideChatName }: HeaderTypes) {
    const { extract } = useContext(UserContext);
    const { chatData, setChatData, participantsInfo } = useContext(ChatContext);

    const inputRef = useRef<HTMLInputElement>(null);

    const [waiting, setWaiting] = useState<boolean>(false);
    const [editingName, setEditingName] = useState<boolean>(false);
    const [doneButtonClicked, setDoneButtonClicked] = useState<boolean>(false);
    const [nameStored, setNameStored] = useState<string>(
        overrideChatName ||
            determineChatName({
                chatData,
                ignoreActiveUser: true,
                activeUserId: `${extract("_id")}` as unknown as extendedTypes.MongooseObjectId,
            }),
    );

    const [chatName, setChatName] = useState<string>(
        overrideChatName ||
            determineChatName({
                chatData,
                ignoreActiveUser: true,
                activeUserId: `${extract("_id")}` as unknown as extendedTypes.MongooseObjectId,
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
                let newChatName = chatName;
                if (chatName.length === 0) {
                    newChatName = determineChatName({
                        chatData,
                        ignoreActiveUser: true,
                        activeUserId:
                            `${extract("_id")}` as unknown as extendedTypes.MongooseObjectId,
                    });
                    if (chatData) setChatData(() => ({ ...chatData, name: "" }));
                } else if (chatData) setChatData(() => ({ ...chatData, name: newChatName }));
                setChatName(newChatName);
                setNameStored(newChatName);
                setEditingName(false);
            }
            setSavedResponse(null);
        }
    }, [savedResponse, chatData, setChatData, chatName, nameStored, extract]);

    useEffect(() => {
        if (!editingName) {
            setChatName(
                determineChatName({
                    chatData,
                    ignoreActiveUser: true,
                    activeUserId: `${extract("_id")}` as unknown as extendedTypes.MongooseObjectId,
                }),
            );
        }
        setNameStored(
            determineChatName({
                chatData,
                ignoreActiveUser: true,
                activeUserId: `${extract("_id")}` as unknown as extendedTypes.MongooseObjectId,
            }),
        );
    }, [chatData, editingName, extract]);

    useEffect(() => {
        setWaiting(settingChatName);
    }, [settingChatName]);

    // subscribe to successful chat image update
    useEffect(() => {
        PubSub.unsubscribe("chat-image-update-successful");
        PubSub.subscribe("chat-image-update-successful", (msg, data) => {
            const { _id, image } = data;
            if (chatData && chatData._id === _id) {
                setChatData((oldChatData) => ({ ...oldChatData, image }) as ChatOverviewResponse);
            }
        });

        return () => {
            PubSub.unsubscribe("chat-image-update-successful");
        };
    }, [chatData, setChatData]);

    return (
        <div className={styles["container"]}>
            <button
                type="button"
                className={styles["chat-image-button"]}
                onClick={() => {
                    PubSub.publish("update-chat-image-button-click", {
                        chatData,
                        participantsInfo,
                    });
                }}
            >
                <Chat.Image chatData={chatData} participantsInfo={participantsInfo} />
            </button>
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
                        PubSub.publish("add-users-to-chat-button-click", {
                            chatId: chatData && chatData._id,
                        });
                    }}
                    palette="blue"
                    otherStyles={{ ...buttonStyles }}
                />
                <Buttons.Basic
                    text=""
                    symbol="call"
                    label="call"
                    disabled
                    palette="blue"
                    otherStyles={{ ...buttonStyles }}
                />
                <Buttons.Basic
                    text=""
                    symbol="videocam"
                    label="call with video"
                    disabled
                    palette="blue"
                    otherStyles={{ ...buttonStyles }}
                />
            </div>
        </div>
    );
}

export default Header;
