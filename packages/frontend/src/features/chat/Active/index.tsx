import { createContext, useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import * as useAsync from "@/hooks/useAsync";
import mongoose from "mongoose";
import Buttons from "@/components/buttons";
import Inputs from "@/components/inputs";
import Accessibility from "@/components/accessibility";
import getChatOverview, { Params, Response } from "@/features/chat/utils/getChatOverview";
import extractParticipantsInformation, {
    ReturnTypes as extractedParticipantsInfo,
} from "./utils/extractParticipantsInformation";
import Chat from "..";
import styles from "./index.module.css";

type ActiveTypes = {
    _id?: mongoose.Types.ObjectId;
    getIdFromURLParam?: boolean;
};

interface ChatState {
    chatData: Response;
    participantsInfo: extractedParticipantsInfo;
    awaitingResponse: boolean;
}

const defaultState: ChatState = {
    chatData: null,
    participantsInfo: {},
    awaitingResponse: true,
};

export const ChatContext = createContext<ChatState>(defaultState);

function Active({ _id, getIdFromURLParam = false }: ActiveTypes) {
    const { chatId } = useParams();

    const [replyingTo, setReplyingTo] = useState<string>("");

    const [waiting, setWaiting] = useState(true);

    const [chatData, setChatData] = useState<Response>(null);
    const [response, setParams, setAttempting, gettingChatOverview] = useAsync.GET<
        Params,
        Response
    >(
        {
            func: getChatOverview,
            parameters: [
                {
                    params: {
                        chatId: !getIdFromURLParam
                            ? _id
                            : (chatId as unknown as mongoose.Types.ObjectId),
                    },
                },
                null,
            ],
        },
        true,
    );
    const [participantsInfo, setParticipantsInfo] = useState<extractedParticipantsInfo>({});
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const newState = response ? response.data : null;
        setChatData(newState);
    }, [response]);

    useEffect(() => {
        setParticipantsInfo(chatData ? extractParticipantsInformation(chatData.participants) : {});
    }, [chatData]);

    useEffect(() => {
        setAttempting(true);
        setErrorMessage("");
        setParams([
            {
                params: {
                    chatId: !getIdFromURLParam
                        ? _id
                        : (chatId as unknown as mongoose.Types.ObjectId),
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
        setWaiting(gettingChatOverview);
    }, [gettingChatOverview]);

    return (
        <ChatContext.Provider
            value={useMemo(
                () => ({ chatData, participantsInfo, awaitingResponse: waiting }),
                [chatData, participantsInfo, waiting],
            )}
        >
            {!waiting ? (
                <div className={styles["container"]}>
                    {errorMessage.length > 0 ? (
                        <p className={styles["error-message"]}>{errorMessage}</p>
                    ) : null}
                    {chatData ? (
                        <div className={styles["chat-content-container"]}>
                            <Chat.Header />
                            <Chat.MessageList getIdFromURLParam />
                            {replyingTo.length > 0 ? (
                                <div className={styles["replying-to-container"]} key={0}>
                                    <Buttons.Basic
                                        text=""
                                        symbol="cancel"
                                        onClickHandler={() => setReplyingTo("")}
                                        otherStyles={{ fontSize: "1.2rem", padding: "0.5rem" }}
                                    />
                                    <p
                                        className={`truncate-ellipsis ${styles["replying-to-string"]}`}
                                        key={0}
                                    >
                                        {`Replying to ${replyingTo}`}
                                    </p>
                                </div>
                            ) : null}
                            <div className={styles["message-box-container"]} key={0}>
                                <Inputs.Message
                                    textFieldId="message-text"
                                    textFieldName="messageText"
                                    placeholder="Type your message..."
                                    imageFieldId="message-images"
                                    imageFieldName="messageImages"
                                />
                            </div>
                        </div>
                    ) : (
                        <p className={styles["empty-message"]}>Nothing to see here!</p>
                    )}
                </div>
            ) : (
                <Accessibility.WaitingWheel />
            )}
        </ChatContext.Provider>
    );
}

export default Active;
