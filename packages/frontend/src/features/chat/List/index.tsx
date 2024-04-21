import { useState, useEffect, useContext } from "react";
import * as useAsync from "@/hooks/useAsync";
import { UserContext } from "@/context/user";
import Buttons from "@/components/buttons";
import Accessibility from "@/components/accessibility";
import mongoose from "mongoose";
import Chat from "..";
import getUserChats, { Params, Response } from "./utils/getUserChats";
import styles from "./index.module.css";

function List() {
    const { user, extract } = useContext(UserContext);

    const [waiting, setWaiting] = useState(true);

    const [chats, setChats] = useState<Response>([]);
    const [response, setParams, setAttempting, gettingChats] = useAsync.GET<Params, Response>(
        {
            func: getUserChats,
            parameters: [
                {
                    params: {
                        userId: extract("_id") as mongoose.Types.ObjectId | undefined | null,
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
        setChats(newState || []);
    }, [response]);

    useEffect(() => {
        setAttempting(true);
        setErrorMessage("");
        setParams([
            {
                params: {
                    userId: extract("_id") as mongoose.Types.ObjectId | undefined | null,
                    after: null,
                },
            },
            null,
        ]);
    }, [user, extract, setParams, setAttempting]);

    useEffect(() => {
        if (response && response.status >= 400 && response.message && response.message.length > 0) {
            setErrorMessage(response.message);
        }
    }, [response]);

    useEffect(() => {
        setWaiting(gettingChats);
    }, [gettingChats]);

    const buttons = (
        <div className={styles["create-new-chat-button-container"]} key={0}>
            <Buttons.Basic
                text="New"
                symbol="add"
                onClickHandler={() => {
                    PubSub.publish("create-new-chat-button-click", null);
                }}
                palette="green"
                otherStyles={{
                    fontSize: "1.15rem",
                    padding: "0.8rem 1.6rem",
                }}
            />
        </div>
    );

    return (
        <div className={styles["container"]}>
            {!waiting ? (
                <>
                    {errorMessage.length > 0 ? (
                        <p className={styles["error-message"]}>{errorMessage}</p>
                    ) : null}
                    {buttons}
                    {chats && chats.length > 0 ? (
                        <div className={styles["chats"]}>
                            {chats.map((chatId) => {
                                return (
                                    <Chat.Option _id={chatId} skeleton key={`follower-${chatId}`} />
                                );
                            })}
                        </div>
                    ) : (
                        <p className={styles["empty-message"]}>Nothing to see here!</p>
                    )}
                </>
            ) : (
                <Accessibility.WaitingWheel />
            )}
        </div>
    );
}

export default List;
