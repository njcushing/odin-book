import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as useAsync from "@/hooks/useAsync";
import mongoose from "mongoose";
import Accessibility from "@/components/accessibility";
import Chat from "..";
import getChatMessages, { Params, Response } from "./utils/getChatMessages";
import styles from "./index.module.css";

type MessageListTypes = {
    _id?: mongoose.Types.ObjectId;
    getIdFromURLParam?: boolean;
};

function MessageList({ _id, getIdFromURLParam = false }: MessageListTypes) {
    const { chatId } = useParams();

    const [waiting, setWaiting] = useState(true);

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
                        after: null,
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
        setMessages(newState || []);
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
                    after: null,
                },
            },
            null,
        ]);
    }, [_id, getIdFromURLParam, chatId, setParams, setAttempting]);

    if (response && response.status === 401) window.location.assign("/");

    useEffect(() => {
        if (response && response.status >= 400 && response.message && response.message.length > 0) {
            setErrorMessage(response.message);
        } else {
            setErrorMessage("");
        }
    }, [response]);

    useEffect(() => {
        setWaiting(gettingMessages);
    }, [gettingMessages]);

    return !waiting ? (
        <div className={styles["container"]}>
            {errorMessage.length > 0 ? (
                <p className={styles["error-message"]}>{errorMessage}</p>
            ) : null}
            {messages && messages.length > 0 ? (
                <div className={styles["scrollable-wrapper"]}>
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
