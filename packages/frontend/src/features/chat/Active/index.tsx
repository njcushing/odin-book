import { createContext, useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import * as useAsync from "@/hooks/useAsync";
import mongoose from "mongoose";
import Accessibility from "@/components/accessibility";
import getChatOverview, { Params, Response } from "@/features/chat/utils/getChatOverview";
import LayoutUI from "@/layouts";
import Infobar from "@/features/infobar";
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
    setChatData: React.Dispatch<React.SetStateAction<Response>>;
    participantsInfo: extractedParticipantsInfo;
    awaitingResponse: boolean;
}

const defaultState: ChatState = {
    chatData: null,
    setChatData: () => {},
    participantsInfo: {},
    awaitingResponse: true,
};

export const ChatContext = createContext<ChatState>(defaultState);

function Active({ _id, getIdFromURLParam = false }: ActiveTypes) {
    const { chatId } = useParams();

    const [waiting, setWaiting] = useState(true);

    // get chat data api handling
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
        setParticipantsInfo(chatData ? extractParticipantsInformation(chatData) : {});
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

    const provider = (
        <ChatContext.Provider
            value={useMemo(
                () => ({ chatData, setChatData, participantsInfo, awaitingResponse: waiting }),
                [chatData, setChatData, participantsInfo, waiting],
            )}
            key={0}
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
                            <Chat.MessageInput />
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

    const info = (
        <Infobar.Wrapper
            style={{
                height: "calc(100% - (2 * 0.4rem))",
                padding: "0.4rem",
            }}
            key={0}
        >
            <Infobar.ChatParticipants participants={participantsInfo} />
        </Infobar.Wrapper>
    );

    return (
        <LayoutUI.Spatial
            width="100%"
            height="auto"
            arrangements={[
                {
                    type: "columns",
                    minWidth: 920,
                    maxWidth: 999999,
                    minHeight: 0,
                    maxHeight: 999999,
                    areas: [
                        { size: "600px", children: [provider] },
                        { size: "320px", children: [info] },
                    ],
                    style: {
                        justifySelf: "flex-start",
                        alignSelf: "flex-start",
                        width: "1200px",
                        height: "auto",
                        padding: "0rem",
                    },
                },
                {
                    type: "columns",
                    minWidth: 600,
                    maxWidth: 920,
                    minHeight: 0,
                    maxHeight: 999999,
                    areas: [{ size: "600px", children: [provider] }],
                    style: {
                        justifySelf: "flex-start",
                        alignSelf: "flex-start",
                        width: "660px",
                        height: "auto",
                        padding: "0rem",
                    },
                },
                {
                    type: "columns",
                    minWidth: 300,
                    maxWidth: 600,
                    minHeight: 0,
                    maxHeight: 999999,
                    areas: [{ size: "300px", children: [provider] }],
                    style: {
                        justifySelf: "flex-start",
                        alignSelf: "flex-start",
                        width: "360px",
                        height: "auto",
                        padding: "0rem",
                    },
                },
                {
                    type: "columns",
                    minWidth: 0,
                    maxWidth: 360,
                    minHeight: 0,
                    maxHeight: 999999,
                    areas: [{ size: "1fr", children: [provider] }],
                    style: {
                        justifySelf: "flex-start",
                        alignSelf: "flex-start",
                        width: "100%",
                        height: "auto",
                        padding: "0rem",
                    },
                },
            ]}
        />
    );
}

export default Active;
