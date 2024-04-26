import React, { useState, useEffect, useContext } from "react";
import * as useAsync from "@/hooks/useAsync";
import { UserContext } from "@/context/user";
import { ChatContext } from "@/features/chat/Active";
import mongoose from "mongoose";
import PubSub from "pubsub-js";
import Buttons from "@/components/buttons";
import Images from "@/components/images";
import Accessibility from "@/components/accessibility";
import formatDate from "@/utils/formatDate";
import getChatMessage, {
    Params as GetChatMessageParams,
    Response as GetChatMessageResponse,
} from "./utils/getChatMessage";
import deleteChatMessage, {
    Params as DeleteChatMessageParams,
    Response as DeleteChatMessageResponse,
} from "./utils/deleteChatMessage";
import styles from "./index.module.css";

type MessageTypes = {
    chatId?: mongoose.Types.ObjectId | undefined | null;
    messageId?: mongoose.Types.ObjectId | undefined | null;
    overrideMessageData?: GetChatMessageResponse;
    messagePreloadInformaton?: {
        author?: mongoose.Types.ObjectId | null;
        imageCount?: number;
        replyingTo?: mongoose.Types.ObjectId | null;
        deleted?: boolean;
    };
    skeleton?: boolean;
};

function Message({
    chatId,
    messageId,
    overrideMessageData,
    messagePreloadInformaton = {
        author: null,
        imageCount: 0,
        replyingTo: null,
        deleted: false,
    },
    skeleton = false,
}: MessageTypes) {
    const { user, extract } = useContext(UserContext);
    const { participantsInfo } = useContext(ChatContext);

    const [waiting, setWaiting] = useState<boolean>(true);
    const [waitingDeletion, setWaitingDeletion] = useState<boolean>(true);

    // get message api handling
    const [messageData, setMessageData] = useState<GetChatMessageResponse>(null);
    const [
        getChatMessageResponse /* setGetChatMessageParams */,
        ,
        getChatMessageAgain,
        gettingChatMessage,
    ] = useAsync.GET<GetChatMessageParams, GetChatMessageResponse>(
        {
            func: getChatMessage,
            parameters: [{ params: { chatId, messageId } }, null],
        },
        !overrideMessageData,
    );
    useEffect(() => {
        if (!overrideMessageData) {
            const newState = getChatMessageResponse ? getChatMessageResponse.data : null;
            setMessageData(newState);
        }
    }, [overrideMessageData, getChatMessageResponse]);

    // delete message api handling
    const [
        deleteChatMessageResponse /* setDeleteChatMessageParams */,
        ,
        deleteChatMessageAgain,
        deletingChatMessage,
    ] = useAsync.DELETE<DeleteChatMessageParams, DeleteChatMessageResponse>(
        {
            func: deleteChatMessage,
            parameters: [{ params: { chatId, messageId } }, null],
        },
        false,
    );
    useEffect(() => {
        if (deleteChatMessageResponse && deleteChatMessageResponse.status < 400) {
            setMessageData((oldMessageData) =>
                oldMessageData
                    ? {
                          ...oldMessageData,
                          text: "",
                          images: [],
                          replyingTo: null,
                          deleted: true,
                          createdAt: oldMessageData.createdAt,
                      }
                    : null,
            );
        }
    }, [deleteChatMessageResponse, getChatMessageAgain]);

    // error message handling
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [deletionErrorMessage, setDeletionErrorMessage] = useState<string>("");
    useEffect(() => {
        if (
            getChatMessageResponse &&
            getChatMessageResponse.status >= 400 &&
            getChatMessageResponse.message &&
            getChatMessageResponse.message.length > 0
        ) {
            setErrorMessage(getChatMessageResponse.message);
        }
    }, [getChatMessageResponse]);
    useEffect(() => {
        if (
            deleteChatMessageResponse &&
            deleteChatMessageResponse.status >= 400 &&
            deleteChatMessageResponse.message &&
            deleteChatMessageResponse.message.length > 0
        ) {
            setDeletionErrorMessage(deleteChatMessageResponse.message);
        }
    }, [deleteChatMessageResponse]);

    // fetch message again
    useEffect(() => {
        if (overrideMessageData) {
            setMessageData(overrideMessageData);
        } else {
            getChatMessageAgain(true);
        }
    }, [user, overrideMessageData, getChatMessageAgain]);

    useEffect(() => {
        setWaiting(gettingChatMessage);
    }, [gettingChatMessage]);

    useEffect(() => {
        setWaitingDeletion(deletingChatMessage);
    }, [deletingChatMessage]);

    let position = "left";
    if (
        (messageData && extract("_id") === messageData.author._id) ||
        (messagePreloadInformaton && extract("_id") === messagePreloadInformaton.author)
    ) {
        position = "right";
    }

    let deleted = false;
    if (messageData && messageData.deleted) {
        deleted = true;
    } else if (messagePreloadInformaton && messagePreloadInformaton.deleted) {
        deleted = true;
    }

    let replyingToDeleted = false;
    if (messageData && messageData.replyingTo && messageData.replyingTo.deleted) {
        replyingToDeleted = true;
    }

    let text = "";
    if (messageData && messageData.deleted) {
        text = "This message has been deleted.";
    } else if (messageData && messageData.text.length > 0) {
        text = messageData.text;
    } else if (waiting) {
        text = "placeholder";
    }

    let replyingToText = "";
    if (messageData && messageData.replyingTo && messageData.replyingTo.deleted) {
        replyingToText = "This message has been deleted.";
    } else if (messageData && messageData.replyingTo && messageData.replyingTo.text.length > 0) {
        replyingToText = messageData.replyingTo.text;
    } else if (waiting) {
        replyingToText = "placeholder";
    }

    let images: React.ReactNode[] = [];
    if (!deleted) {
        if (messageData && messageData.images.length > 0) {
            images = messageData.images.map((image, i) => {
                if (i >= 4) return null;
                return (
                    <li className={styles["message-image"]} key={`${image._id}`}>
                        <Images.Basic
                            src={image.url}
                            alt={image.alt}
                            style={{ width: "100%", height: "100%" }}
                        />
                    </li>
                );
            });
        } else if (messagePreloadInformaton && messagePreloadInformaton.imageCount) {
            for (let i = 0; i < Math.min(4, messagePreloadInformaton.imageCount); i++) {
                images.push(
                    <li className={styles["message-image"]} key={i}>
                        <Images.Basic src="" alt="" style={{ width: "100%", height: "100%" }} />
                    </li>,
                );
            }
        }
    }

    let replyingToImages: React.ReactNode[] = [];
    if (!replyingToDeleted) {
        if (messageData && messageData.replyingTo && messageData.replyingTo.images.length > 0) {
            replyingToImages = messageData.replyingTo.images.map((image, i) => {
                if (i >= 4) return null;
                return (
                    <li className={styles["message-image"]} key={`${image._id}`}>
                        <Images.Basic
                            src={image.url}
                            alt={image.alt}
                            style={{ width: "100%", height: "100%" }}
                        />
                    </li>
                );
            });
        }
    }

    let username = "User";
    if (messageData) {
        if (`${messageData.author._id}` in participantsInfo) {
            username = participantsInfo[`${messageData.author._id}`].inChatName;
        } else if (messageData.author.preferences.displayName.length > 0) {
            username = messageData.author.preferences.displayName;
        } else {
            username = messageData.author.accountTag;
        }
    }

    let replyingToUsername = "User";
    if (messageData && messageData.replyingTo) {
        if (`${messageData.replyingTo.author._id}` in participantsInfo) {
            replyingToUsername =
                participantsInfo[`${messageData.replyingTo.author._id}`].inChatName;
        } else if (messageData.replyingTo.author.preferences.displayName.length > 0) {
            replyingToUsername = messageData.replyingTo.author.preferences.displayName;
        } else {
            replyingToUsername = messageData.replyingTo.author.accountTag;
        }
    }

    const containerWidth = messageData === null ? "100%" : "auto";

    const messageContainerStyles: React.CSSProperties =
        position === "left"
            ? {
                  justifySelf: "start",
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                  borderBottomLeftRadius: "0px",
                  borderBottomRightRadius: "12px",
                  width: "100%",
                  maxWidth: "calc(100% - (2 * 0.4rem))",
                  padding: "0.4rem",
              }
            : {
                  justifySelf: "end",
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                  borderBottomLeftRadius: "12px",
                  borderBottomRightRadius: "0px",
                  width: "100%",
                  maxWidth: "calc(100% - (2 * 0.4rem))",
                  padding: "0.4rem",
              };

    const nameAndDateStringStyles: React.CSSProperties =
        position === "left"
            ? {
                  gridArea: "2 / 2 / -1 / -1",
                  justifySelf: "start",
                  width: messageData === null ? "60%" : "auto",
              }
            : {
                  gridArea: "2 / 1 / -1 / 3",
                  justifySelf: "end",
                  width: messageData === null ? "60%" : "auto",
              };

    return (
        <div className={styles["wrapper"]} data-position={position}>
            {errorMessage.length > 0 ? (
                <p className={styles["error-message"]}>{errorMessage}</p>
            ) : null}
            {deletionErrorMessage.length > 0 ? (
                <p className={styles["error-message"]}>{deletionErrorMessage}</p>
            ) : null}
            {skeleton || messageData ? (
                <div className={styles["container"]} style={{ width: containerWidth }}>
                    <div className={styles["profile-image"]}>
                        <Accessibility.Skeleton
                            waiting={waiting}
                            style={{ borderRadius: "9999px" }}
                        >
                            <Images.Profile
                                src={
                                    messageData && messageData.author.preferences.profileImage
                                        ? messageData.author.preferences.profileImage.url
                                        : ""
                                }
                                alt={
                                    messageData && messageData.author.preferences.profileImage
                                        ? messageData.author.preferences.profileImage.alt
                                        : ""
                                }
                                sizePx={48}
                            />
                        </Accessibility.Skeleton>
                    </div>
                    <Accessibility.Skeleton waiting={waiting} style={messageContainerStyles}>
                        <div className={styles["message-container"]} style={messageContainerStyles}>
                            {text.length > 0 ? (
                                <p
                                    className={`${styles["message-text"]} ${deleted ? styles["deleted"] : ""}`}
                                    aria-label="message-text"
                                >
                                    {text}
                                </p>
                            ) : null}
                            {images.length > 0 && (
                                <ul
                                    className={styles["message-images-container"]}
                                    data-image-quantity={`${Math.min(4, images.length)}`}
                                >
                                    {images}
                                </ul>
                            )}
                            {(messageData && messageData.replyingTo) ||
                            (!messageData &&
                                messagePreloadInformaton &&
                                messagePreloadInformaton.replyingTo) ||
                            replyingToDeleted ? (
                                <div className={styles["replying-to-message-container"]}>
                                    <p
                                        className={styles["replying-to-message-username"]}
                                        aria-label="replying-to-message-username"
                                    >
                                        {`Replying to ${replyingToUsername}:`}
                                    </p>
                                    {replyingToText.length > 0 ? (
                                        <p
                                            className={`${styles["replying-to-message-text"]} ${replyingToDeleted ? styles["deleted"] : ""}`}
                                            aria-label="replying-to-message-text"
                                        >
                                            {replyingToText}
                                        </p>
                                    ) : null}
                                    {replyingToImages.length > 0 && (
                                        <ul
                                            className={
                                                styles["replying-to-message-images-container"]
                                            }
                                            data-image-quantity={`${Math.min(4, replyingToImages.length)}`}
                                        >
                                            {replyingToImages}
                                        </ul>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </Accessibility.Skeleton>
                    <div className={styles["option-buttons"]}>
                        <Accessibility.Skeleton
                            waiting={waiting}
                            style={{ borderRadius: "9999px" }}
                        >
                            <Buttons.Basic
                                text=""
                                symbol="reply"
                                onClickHandler={() => {
                                    if (messageId && messageData) {
                                        PubSub.publish("reply-to-message-button-click", {
                                            messageId: messageData._id,
                                            userId: messageData.author._id,
                                        });
                                    }
                                }}
                                disabled={waiting}
                                style={{ shape: "rounded" }}
                                otherStyles={{ padding: "0.4rem" }}
                            />
                        </Accessibility.Skeleton>
                        {position === "right" && !deleted ? (
                            <Accessibility.Skeleton
                                waiting={waiting}
                                style={{ borderRadius: "9999px" }}
                            >
                                <Buttons.Basic
                                    text=""
                                    symbol="delete"
                                    onClickHandler={() => deleteChatMessageAgain(true)}
                                    disabled={waitingDeletion}
                                    style={{ shape: "rounded" }}
                                    otherStyles={{ padding: "0.4rem" }}
                                />
                            </Accessibility.Skeleton>
                        ) : null}
                    </div>
                    <Accessibility.Skeleton
                        waiting={waiting}
                        style={{ ...nameAndDateStringStyles }}
                    >
                        <p
                            className={styles["name-and-date-string"]}
                            aria-label="author-and-date"
                            style={nameAndDateStringStyles}
                        >
                            {`${username} at ${messageData ? formatDate(messageData.createdAt) : "unknown"}`}
                        </p>
                    </Accessibility.Skeleton>
                </div>
            ) : null}
        </div>
    );
}

export default Message;
