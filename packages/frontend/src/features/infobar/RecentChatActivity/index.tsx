import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@/context/user";
import * as useAsync from "@/hooks/useAsync";
import mongoose from "mongoose";
import extractParticipantsInformation, {
    ReturnTypes as extractedParticipantsInfo,
} from "@/features/chat/Active/utils/extractParticipantsInformation";
import Chat from "@/features/chat";
import Accessibility from "@/components/accessibility";
import determineChatName from "@/features/chat/utils/determineChatName";
import createMultilineTextTruncateStyles from "@/utils/createMultilineTextTruncateStyles";
import getRecentChatActivity, { Params, Response } from "./utils/getRecentChatActivity";
import styles from "./index.module.css";

export type TRecentChatActivity = {
    style?: React.CSSProperties;
};

function RecentChatActivity({ style }: TRecentChatActivity) {
    const { user, extract } = useContext(UserContext);

    const navigate = useNavigate();

    const [waiting, setWaiting] = useState(true);

    const [recentChatActivity, setRecentChatActivity] = useState<Response>([]);
    const [participantsInfo, setParticipantsInfo] = useState<extractedParticipantsInfo[]>([]);
    const [response, setParams, setAttempting, creatingMessage] = useAsync.GET<Params, Response>(
        {
            func: getRecentChatActivity,
            parameters: [
                {
                    params: {
                        userId: extract("_id") as mongoose.Types.ObjectId | undefined | null,
                    },
                },
                null,
            ],
        },
        false,
    );
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const newState = response ? response.data : [];
        setRecentChatActivity(() => newState);
    }, [response]);

    useEffect(() => {
        setAttempting(true);
        setErrorMessage("");
        setParams([
            {
                params: {
                    userId: extract("_id") as mongoose.Types.ObjectId | undefined | null,
                },
            },
            null,
        ]);
    }, [user, extract, setParams, setAttempting]);

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
        setParticipantsInfo(
            recentChatActivity
                ? recentChatActivity.map((chatData) => {
                      return extractParticipantsInformation(chatData);
                  })
                : [],
        );
    }, [recentChatActivity]);

    useEffect(() => {
        setWaiting(creatingMessage);
    }, [creatingMessage]);

    return (
        <div className={styles["container"]} style={style}>
            {!waiting ? (
                <>
                    <h4 className={styles["title"]}>Recent Chat Activity</h4>
                    {recentChatActivity && recentChatActivity.length > 0 ? (
                        <ul className={styles["activity-list"]}>
                            {recentChatActivity.map((chatData, i) => {
                                if (!chatData) return null;

                                const chatName = determineChatName({ chatData });

                                const username = (() => {
                                    if (chatData && chatData.recentMessage) {
                                        for (let j = 0; j < chatData.participants.length; j++) {
                                            const participant = chatData.participants[j];
                                            const userId = `${participant.user._id}`;
                                            if (`${chatData.recentMessage.author}` === userId) {
                                                if (participant.nickname.length > 0) {
                                                    return participant.nickname;
                                                }
                                                if (
                                                    participant.user.preferences.displayName
                                                        .length > 0
                                                ) {
                                                    return participant.user.preferences.displayName;
                                                }
                                                return participant.user.accountTag;
                                            }
                                        }
                                    }
                                    return "User";
                                })();

                                let recentMessage = "";
                                if (chatData && chatData.recentMessage) {
                                    if (chatData.recentMessage.deleted) {
                                        recentMessage = "This message has been deleted.";
                                    } else if (chatData.recentMessage.text.length > 0) {
                                        recentMessage = chatData.recentMessage.text;
                                    } else {
                                        recentMessage = `Sent ${chatData.recentMessage.imageCount} images`;
                                    }
                                }

                                return (
                                    <button
                                        type="button"
                                        className={styles["activity-container"]}
                                        onClick={(e) => {
                                            navigate(`/chat/${chatData._id}`);
                                            e.currentTarget.blur();
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.blur();
                                        }}
                                        key={`infobar-recent-chat-activity-${chatData._id}`}
                                    >
                                        <Chat.Image
                                            chatData={chatData}
                                            participantsInfo={participantsInfo[i]}
                                            style={{ width: "48px", height: "48px" }}
                                        />
                                        <div className={styles["activity-content-container"]}>
                                            <p className={`truncate-ellipsis ${styles["name"]}`}>
                                                <strong>{`${username} `}</strong>replied to
                                                <strong>{` ${chatName}`}</strong>
                                            </p>
                                            {recentMessage.length > 0 ? (
                                                <p
                                                    className={styles["message"]}
                                                    style={{
                                                        ...createMultilineTextTruncateStyles(2),
                                                    }}
                                                >
                                                    {recentMessage}
                                                </p>
                                            ) : null}
                                        </div>
                                    </button>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className={styles["no-activity-message"]}>
                            There is no chat activity to display yet.
                        </p>
                    )}
                    {errorMessage.length > 0 ? (
                        <p className={styles["error-message"]}>{errorMessage}</p>
                    ) : null}
                </>
            ) : (
                <Accessibility.WaitingWheel />
            )}
        </div>
    );
}

export default RecentChatActivity;
