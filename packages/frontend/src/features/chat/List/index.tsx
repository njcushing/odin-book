import { useContext, useState, useEffect, useRef } from "react";
import * as useAsync from "@/hooks/useAsync";
import { AppContext } from "@/App";
import { UserContext } from "@/context/user";
import Buttons from "@/components/buttons";
import PubSub from "pubsub-js";
import Accessibility from "@/components/accessibility";
import mongoose from "mongoose";
import Chat from "..";
import getUserChats, { Params, Response } from "./utils/getUserChats";
import styles from "./index.module.css";

function List() {
    const { isScrollable } = useContext(AppContext);
    const { user, extract, awaitingResponse } = useContext(UserContext);

    const errorMessageRef = useRef(null);
    const [errorMessageHeight, setErrorMessageHeight] = useState<number>(0);
    const createNewChatButtonRef = useRef(null);
    const [createNewChatButtonHeight, setCreateNewChatButtonHeight] = useState<number>(0);

    const [waiting, setWaiting] = useState(false);

    const [chats, setChats] = useState<Response>(null);
    const [chatsQuantityFromLastRequest, setChatsQuantityFromLastRequest] = useState<number>(0);
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
        false,
    );
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const newState = response ? response.data : null;
        setChats((currentChats) => {
            return currentChats ? currentChats.concat(newState || []) : newState || null;
        });
        setChatsQuantityFromLastRequest(newState ? newState.length : 0);
    }, [response]);

    useEffect(() => {
        if (!isScrollable && chatsQuantityFromLastRequest > 0 && chats) {
            setAttempting(true);
            setParams([
                {
                    params: {
                        userId: extract("_id") as mongoose.Types.ObjectId | undefined | null,
                        after: chats[chats.length - 1],
                    },
                },
                null,
            ]);
        }
    }, [isScrollable, chatsQuantityFromLastRequest, chats, setAttempting, setParams, extract]);

    useEffect(() => {
        if (!awaitingResponse) {
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
        }
    }, [user, extract, awaitingResponse, setParams, setAttempting]);

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
        setWaiting(gettingChats);
    }, [gettingChats]);

    // subscribe to successful chat creation
    useEffect(() => {
        PubSub.subscribe("chat-creation-successful", (msg, data) => {
            setChats((oldChats) => {
                return oldChats ? [data, ...oldChats] : [];
            });
        });

        return () => {
            PubSub.unsubscribe("chat-creation-successful");
        };
    }, []);

    // subscribe to main App component's scroll topic
    useEffect(() => {
        PubSub.unsubscribe("page-scroll-reached-bottom");
        PubSub.subscribe("page-scroll-reached-bottom", () => {
            if (!waiting && chats) {
                setAttempting(true);
                setParams([
                    {
                        params: {
                            userId: extract("_id") as mongoose.Types.ObjectId | undefined | null,
                            after: chats[chats.length - 1],
                        },
                    },
                    null,
                ]);
            }
        });

        return () => {
            PubSub.unsubscribe("page-scroll-reached-bottom");
        };
    }, [extract, chats, setAttempting, setParams, waiting]);

    useEffect(() => {
        let errorMessageRefCurrent: Element;
        let createNewChatButtonRefCurrent: Element;

        const errorMessageObserver = new ResizeObserver((entries) => {
            const contentHeight = entries[0].contentRect.height;
            const padding =
                parseFloat(window.getComputedStyle(entries[0].target).paddingTop) +
                parseFloat(window.getComputedStyle(entries[0].target).paddingBottom);
            const totalHeight = contentHeight + padding;
            setErrorMessageHeight(totalHeight || 0);
            PubSub.publish("page-scrollable-area-shift-down", totalHeight);
        });
        if (errorMessageRef.current) {
            errorMessageRefCurrent = errorMessageRef.current;
            errorMessageObserver.unobserve(errorMessageRef.current);
            errorMessageObserver.observe(errorMessageRef.current);
        }

        const createNewChatButtonObserver = new ResizeObserver((entries) => {
            const contentHeight = entries[0].contentRect.height;
            const padding =
                parseFloat(window.getComputedStyle(entries[0].target).paddingTop) +
                parseFloat(window.getComputedStyle(entries[0].target).paddingBottom);
            const totalHeight = contentHeight + padding;
            setCreateNewChatButtonHeight(totalHeight || 0);
        });
        if (createNewChatButtonRef.current) {
            createNewChatButtonRefCurrent = createNewChatButtonRef.current;
            createNewChatButtonObserver.unobserve(createNewChatButtonRef.current);
            createNewChatButtonObserver.observe(createNewChatButtonRef.current);
        }

        return () => {
            if (errorMessageRefCurrent instanceof Element) {
                errorMessageObserver.unobserve(errorMessageRefCurrent);
            }
            if (createNewChatButtonRefCurrent instanceof Element) {
                createNewChatButtonObserver.unobserve(createNewChatButtonRefCurrent);
            }
        };
    }, [chats, errorMessage, errorMessageRef, createNewChatButtonRef]);

    useEffect(() => {
        const publish = () => {
            PubSub.publish("infobar-set-choices", ["RecommendedUsers", "RecentPosts"]);
        };

        PubSub.subscribe("infobar-ready", () => publish());
        publish();

        return () => {
            PubSub.unsubscribe("infobar-ready");
        };
    }, []);

    return (
        <div className={styles["container"]} key={0}>
            {!(waiting && (!chats || chats.length === 0)) ? (
                <>
                    <div style={{ height: errorMessageHeight }}></div>
                    {chats && chats.length > 0 ? (
                        <div className={styles["chats"]}>
                            {chats.map((chatId) => {
                                return <Chat.Option _id={chatId} skeleton key={`chat-${chatId}`} />;
                            })}
                        </div>
                    ) : (
                        <p className={styles["empty-message"]}>
                            {chats && chats.length === 0 ? "Nothing to see here!" : ""}
                        </p>
                    )}
                    <div style={{ height: createNewChatButtonHeight }}></div>
                    <div className={styles["sticky-wrapper"]}>
                        <div className={styles["sticky-container"]}>
                            {errorMessage.length > 0 ? (
                                <p className={styles["error-message"]} ref={errorMessageRef}>
                                    {errorMessage}
                                </p>
                            ) : (
                                <p ref={errorMessageRef}></p>
                            )}
                            <div
                                className={styles["create-new-chat-button-container"]}
                                ref={createNewChatButtonRef}
                            >
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
                        </div>
                    </div>
                </>
            ) : (
                <Accessibility.WaitingWheel />
            )}
        </div>
    );
}

export default List;
