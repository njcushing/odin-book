import { useContext, useState, useEffect, useRef } from "react";
import * as useAsync from "@/hooks/useAsync";
import { UserContext } from "@/context/user";
import Buttons from "@/components/buttons";
import Infobar from "@/features/infobar";
import LayoutUI from "@/layouts";
import PubSub from "pubsub-js";
import Accessibility from "@/components/accessibility";
import mongoose from "mongoose";
import Chat from "..";
import getUserChats, { Params, Response } from "./utils/getUserChats";
import styles from "./index.module.css";

function List() {
    const { user, extract } = useContext(UserContext);

    const errorMessageRef = useRef(null);
    const [errorMessageHeight, setErrorMessageHeight] = useState<number>(0);
    const createNewChatButtonRef = useRef(null);
    const [createNewChatButtonHeight, setCreateNewChatButtonHeight] = useState<number>(0);

    const [initialWaiting, setInitialWaiting] = useState(true);
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
        setChats((currentChats) => {
            return currentChats ? currentChats.concat(newState || []) : newState || [];
        });
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
        if (response) {
            if (response.status >= 400 && response.message && response.message.length > 0) {
                setErrorMessage(response.message);
            } else {
                setErrorMessage("");
            }
        }
    }, [response]);

    useEffect(() => {
        if (!gettingChats) setInitialWaiting(gettingChats);
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
            setErrorMessageHeight(totalHeight);
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
            setCreateNewChatButtonHeight(totalHeight);
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

    const list = (
        <div className={styles["container"]} key={0}>
            {!initialWaiting ? (
                <>
                    <div style={{ height: errorMessageHeight }}></div>
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

    const info = (
        <Infobar.Wrapper
            style={{
                height: "calc(100% - (2 * 0.4rem))",
                minHeight: "500px",
                padding: "0.4rem",
                gap: "0.4rem",
            }}
            key={0}
        >
            <Infobar.RecommendedUsers />
            <Infobar.RecentPosts />
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
                        { size: "600px", children: [list] },
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
                    areas: [{ size: "600px", children: [list] }],
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
                    areas: [{ size: "300px", children: [list] }],
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
                    areas: [{ size: "1fr", children: [list] }],
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

export default List;
