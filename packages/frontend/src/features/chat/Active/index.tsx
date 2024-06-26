import { createContext, useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import * as useAsync from "@/hooks/useAsync";
import * as extendedTypes from "@shared/utils/extendedTypes";
import Accessibility from "@/components/accessibility";
import getChatOverview, { Params, Response } from "@/features/chat/utils/getChatOverview";
import Infobar from "@/features/infobar";
import extractParticipantsInformation, {
    ReturnTypes as extractedParticipantsInfo,
} from "./utils/extractParticipantsInformation";
import Chat from "..";
import styles from "./index.module.css";

type ActiveTypes = {
    _id?: extendedTypes.MongooseObjectId;
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
                            : (chatId as unknown as extendedTypes.MongooseObjectId),
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
                        : (chatId as unknown as extendedTypes.MongooseObjectId),
                },
            },
            null,
        ]);
    }, [_id, getIdFromURLParam, chatId, setParams, setAttempting]);

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

    // subscribe to users being successfully added update
    useEffect(() => {
        PubSub.unsubscribe("chat-add-users-successful");
        PubSub.subscribe("chat-add-users-successful", (msg, data) => {
            const { participants } = data;
            const existingParticipants = chatData ? chatData.participants : [];
            if (chatData) {
                setChatData(
                    (oldChatData) =>
                        ({
                            ...oldChatData,
                            participants: [...existingParticipants, ...participants],
                        }) as Response,
                );
            }
        });

        return () => {
            PubSub.unsubscribe("chat-add-users-successful");
        };
    }, [chatData, setChatData]);

    useEffect(() => {
        const publish = () => {
            PubSub.publish("infobar-set-style", {
                height: "calc(calc(var(--vh, 1vh) * 100) - (2 * 0.4rem))",
                padding: "0.4rem",
            });
            PubSub.publish("infobar-set-choices", []);
            PubSub.publish("infobar-set-children", [
                <Infobar.ChatParticipants participants={participantsInfo} key={0} />,
            ]);
        };

        PubSub.subscribe("infobar-ready", () => publish());
        publish();

        return () => {
            PubSub.unsubscribe("infobar-ready");
            PubSub.publish("infobar-set-style");
            PubSub.publish("infobar-set-children");
        };
    }, [participantsInfo]);

    return (
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
}

export default Active;
