import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@/context/user";
import * as useAsync from "@/hooks/useAsync";
import Images from "@/components/images";
import Accessibility from "@/components/accessibility";
import mongoose from "mongoose";
import getChatOverview, { Params, Response } from "@/features/chat/utils/getChatOverview";
import determineChatName from "@/features/chat/utils/determineChatName";
import styles from "./index.module.css";

type OptionTypes = {
    _id: mongoose.Types.ObjectId | undefined | null;
    overrideOptionData?: Response;
    skeleton?: boolean;
};

function Option({ _id, overrideOptionData, skeleton = false }: OptionTypes) {
    const { extract } = useContext(UserContext);

    const navigate = useNavigate();

    const [waiting, setWaiting] = useState<boolean>(true);

    // get option api handling
    const [chatData, setChatData] = useState<Response>(null);
    const [
        getChatOverviewResponse /* setGetChatOverviewParams */,
        ,
        getChatOverviewAgain,
        gettingChatOverview,
    ] = useAsync.GET<Params, Response>(
        {
            func: getChatOverview,
            parameters: [{ params: { chatId: _id } }, null],
        },
        !overrideOptionData,
    );
    useEffect(() => {
        if (!overrideOptionData) {
            const newState = getChatOverviewResponse ? getChatOverviewResponse.data : null;
            setChatData(newState);
        }
    }, [overrideOptionData, getChatOverviewResponse]);

    // error message handling
    const [errorMessage, setErrorMessage] = useState<string>("");
    useEffect(() => {
        if (
            getChatOverviewResponse &&
            getChatOverviewResponse.status >= 400 &&
            getChatOverviewResponse.message &&
            getChatOverviewResponse.message.length > 0
        ) {
            setErrorMessage(getChatOverviewResponse.message);
        }
    }, [getChatOverviewResponse]);

    // fetch option again
    useEffect(() => {
        if (overrideOptionData) {
            setChatData(overrideOptionData);
        } else {
            getChatOverviewAgain(true);
        }
    }, [overrideOptionData, getChatOverviewAgain]);

    useEffect(() => {
        setWaiting(gettingChatOverview);
    }, [gettingChatOverview]);

    const chatName = determineChatName({
        chatData,
        ignoreActiveUser: true,
        activeUserId: `${extract("_id")}` as unknown as mongoose.Types.ObjectId,
    });

    const username = (() => {
        if (chatData && chatData.recentMessage) {
            for (let i = 0; i < chatData.participants.length; i++) {
                const participant = chatData.participants[i];
                const userId = `${participant.user._id}`;
                if (`${chatData.recentMessage.author}` === userId) {
                    if (participant.nickname.length > 0) {
                        return participant.nickname;
                    }
                    if (participant.user.preferences.displayName.length > 0) {
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
        recentMessage = `${username}: ${chatData.recentMessage.text}`;
    } else if (waiting) {
        recentMessage = "placeholder";
    }

    return (
        <button
            className={styles["container"]}
            type="button"
            onClick={() => {
                navigate(`/chat/${_id}`);
            }}
        >
            {skeleton || chatData ? (
                <>
                    <div className={styles["profile-image-container"]}>
                        <Accessibility.Skeleton
                            waiting={waiting}
                            style={{ borderRadius: "9999px" }}
                        >
                            <Images.Profile
                                src={chatData && chatData.image ? chatData.image.url : ""}
                                alt={chatData && chatData.image ? chatData.image.alt : ""}
                                sizePx={64}
                            />
                        </Accessibility.Skeleton>
                    </div>
                    <div className={styles["name-and-message-container"]}>
                        <Accessibility.Skeleton waiting={waiting} style={{ width: "100%" }}>
                            <p
                                className={`truncate-ellipsis ${styles["name"]}`}
                                aria-label="chat name"
                            >
                                {chatName}
                            </p>
                        </Accessibility.Skeleton>
                        <Accessibility.Skeleton waiting={waiting} style={{ width: "100%" }}>
                            {recentMessage.length > 0 ? (
                                <p
                                    className={`truncate-ellipsis ${styles["message"]}`}
                                    aria-label="recent message"
                                >
                                    {recentMessage}
                                </p>
                            ) : null}
                        </Accessibility.Skeleton>
                        {errorMessage.length > 0 ? (
                            <p className={styles["error-message"]}>{errorMessage}</p>
                        ) : null}
                    </div>
                </>
            ) : null}
        </button>
    );
}

export default Option;
