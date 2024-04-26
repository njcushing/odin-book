import { useState, useEffect } from "react";
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

    const chatName = determineChatName(chatData);

    let recentMessage = "";
    if (chatData && chatData.recentMessage) {
        recentMessage = `${chatData.recentMessage.author}: ${chatData.recentMessage.text}`;
    } else if (waiting) {
        recentMessage = "placeholder";
    }

    return (
        <a className={styles["container"]} href={`/chat/${_id}`}>
            {errorMessage.length > 0 ? (
                <p className={styles["error-message"]}>{errorMessage}</p>
            ) : null}
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
                    </div>
                </>
            ) : null}
        </a>
    );
}

export default Option;
