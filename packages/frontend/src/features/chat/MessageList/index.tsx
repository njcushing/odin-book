import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import * as useAsync from "@/hooks/useAsync";
import mongoose from "mongoose";
import Accessibility from "@/components/accessibility";
import useScrollableElement from "@/hooks/useScrollableElement";
import Chat from "..";
import getChatMessages, { Params, Response } from "./utils/getChatMessages";
import styles from "./index.module.css";

type MessageListTypes = {
    _id?: mongoose.Types.ObjectId;
    getIdFromURLParam?: boolean;
};

function MessageList({ _id, getIdFromURLParam = false }: MessageListTypes) {
    const { chatId } = useParams();

    const [initialWaiting, setInitialWaiting] = useState(true);
    const [, /* waiting */ setWaiting] = useState(true);

    const [messages, setMessages] = useState<Response>([]);
    const [response, setParams, setAttempting, gettingMessages] = useAsync.GET<Params, Response>(
        {
            func: getChatMessages,
            parameters: [
                {
                    params: {
                        chatId: !getIdFromURLParam
                            ? _id
                            : (chatId as unknown as mongoose.Types.ObjectId),
                        before: null,
                    },
                },
                null,
            ],
        },
        true,
    );
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const newState = response ? response.data : [];
        setMessages((currentMessages) => {
            return currentMessages ? currentMessages.concat(newState || []) : newState || [];
        });
    }, [response]);

    useEffect(() => {
        setAttempting(true);
        setErrorMessage("");
        setParams([
            {
                params: {
                    chatId: !getIdFromURLParam
                        ? _id
                        : (chatId as unknown as mongoose.Types.ObjectId),
                    before: null,
                },
            },
            null,
        ]);
    }, [_id, getIdFromURLParam, chatId, setParams, setAttempting]);

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
        if (!gettingMessages) setInitialWaiting(gettingMessages);
    }, [gettingMessages]);

    useEffect(() => {
        setWaiting(gettingMessages);
    }, [gettingMessages]);

    // subscribe to successful message creation
    useEffect(() => {
        PubSub.subscribe("message-creation-successful", (msg, data) => {
            setMessages((oldMessages) => {
                return oldMessages ? [data, ...oldMessages] : [];
            });
        });

        return () => {
            PubSub.unsubscribe("message-creation-successful");
        };
    }, []);

    const scrollableWrapperRef = useRef<HTMLDivElement>(null);
    useScrollableElement({
        ref: scrollableWrapperRef,
        atTopCallback: () => {
            if (!gettingMessages && messages) {
                setAttempting(true);
                setParams([
                    {
                        params: {
                            chatId: !getIdFromURLParam
                                ? _id
                                : (chatId as unknown as mongoose.Types.ObjectId),
                            before: messages[messages.length - 1]._id,
                        },
                    },
                    null,
                ]);
            }
        },
        isInverted: true,
        onlyCallbackOnCorrectDirectionalScroll: true,
    });

    return !initialWaiting ? (
        <div className={styles["container"]}>
            {errorMessage.length > 0 ? (
                <p className={styles["error-message"]}>{errorMessage}</p>
            ) : null}
            {messages && messages.length > 0 ? (
                <div className={styles["scrollable-wrapper"]} ref={scrollableWrapperRef}>
                    <li className={styles["message-list"]}>
                        {messages.map((message) => {
                            return (
                                <Chat.Message
                                    chatId={
                                        !getIdFromURLParam
                                            ? _id
                                            : (chatId as unknown as mongoose.Types.ObjectId)
                                    }
                                    messageId={message._id}
                                    messagePreloadInformaton={{
                                        author: message.author,
                                        imageCount: message.imageCount,
                                        replyingTo: message.replyingTo,
                                    }}
                                    skeleton
                                    key={`message-${message._id}`}
                                />
                            );
                        })}
                    </li>
                </div>
            ) : (
                <p className={styles["empty-message"]}>Be the first person to send a message!</p>
            )}
        </div>
    ) : (
        <Accessibility.WaitingWheel />
    );
}

export default MessageList;
