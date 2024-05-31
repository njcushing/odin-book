import { useContext, useState, useEffect } from "react";
import * as useAsync from "@/hooks/useAsync";
import { ChatContext } from "@/features/chat/Active";
import PubSub from "pubsub-js";
import Buttons from "@/components/buttons";
import Inputs from "@/components/inputs";
import * as extendedTypes from "@shared/utils/extendedTypes";
import validation from "@shared/validation";
import { v4 as uuidv4 } from "uuid";
import createMessage, { Params, Body, Response } from "./utils/createMessage";
import styles from "./index.module.css";

type ReplyingTo = {
    messageId: string;
    inChatName: string;
} | null;

function MessageInput() {
    const { chatData, participantsInfo } = useContext(ChatContext);

    const [waiting, setWaiting] = useState(true);
    const [replyingTo, setReplyingTo] = useState<ReplyingTo>(null);
    const [generateKey, setGenerateKey] = useState<string>(uuidv4());

    const [response, setParams, setAttempting, creatingMessage] = useAsync.POST<
        Params,
        Body,
        Response
    >(
        {
            func: createMessage,
            parameters: [
                {
                    params: { chatId: chatData && chatData._id },
                    body: {
                        replyingTo: replyingTo
                            ? (replyingTo.messageId as unknown as extendedTypes.MongooseObjectId)
                            : null,
                        text: "",
                        images: [],
                    },
                },
                null,
            ],
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
                setReplyingTo(null);
                PubSub.publish("message-creation-successful", response.data);

                // easy way to re-render Inputs.Message component on successful message creation, clearing inputs
                setGenerateKey(uuidv4());
            }
        }
    }, [response]);

    useEffect(() => {
        setWaiting(creatingMessage);
    }, [creatingMessage]);

    // subscribe to message reply button click
    useEffect(() => {
        PubSub.subscribe("reply-to-message-button-click", (msg, data) => {
            if (replyingTo && data.messageId === replyingTo.messageId) {
                setReplyingTo(null);
            } else {
                const inChatName =
                    data.userId in participantsInfo ? participantsInfo[data.userId].inChatName : "";
                setReplyingTo({ messageId: data.messageId, inChatName });
            }
        });

        return () => {
            PubSub.unsubscribe("reply-to-message-button-click");
        };
    }, [replyingTo, participantsInfo]);

    return (
        <>
            {replyingTo && !waiting ? (
                <div className={styles["replying-to-container"]}>
                    <Buttons.Basic
                        text=""
                        symbol="cancel"
                        onClickHandler={() => setReplyingTo(null)}
                        otherStyles={{ fontSize: "1.2rem", padding: "0.5rem" }}
                    />
                    <p className={`truncate-ellipsis ${styles["replying-to-string"]}`}>
                        {`Replying to ${replyingTo.inChatName}`}
                    </p>
                </div>
            ) : null}
            <div className={styles["input-container"]}>
                <Inputs.Message
                    textFieldId="message-text"
                    textFieldName="messageText"
                    placeholder="Type your message..."
                    imageFieldId="message-images"
                    imageFieldName="messageImages"
                    textValidator={{ func: validation.message.text }}
                    imageValidator={{ func: validation.message.imageArray }}
                    onSendHandler={(text, images) => {
                        setAttempting(true);
                        setErrorMessage("");
                        setParams([
                            {
                                params: { chatId: chatData && chatData._id },
                                body: {
                                    replyingTo: replyingTo
                                        ? (replyingTo.messageId as unknown as extendedTypes.MongooseObjectId)
                                        : null,
                                    text,
                                    images: Object.keys(images).map((key) => images[key].data),
                                },
                            },
                            null,
                        ]);
                    }}
                    sending={waiting}
                    key={generateKey}
                />
            </div>
            {errorMessage.length > 0 ? (
                <p className={styles["error-message"]}>{errorMessage}</p>
            ) : null}
        </>
    );
}

export default MessageInput;
