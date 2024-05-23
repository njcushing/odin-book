import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as useAsync from "@/hooks/useAsync";
import { AppContext } from "@/App";
import { UserContext } from "@/context/user";
import Buttons from "@/components/buttons";
import PubSub from "pubsub-js";
import mongoose from "mongoose";
import Accessibility from "@/components/accessibility";
import getRecommendedPosts, { Params, Response } from "./utils/getRecommendedPosts";
import Posts from "..";
import styles from "./index.module.css";

function List() {
    const { isScrollable } = useContext(AppContext);
    const { user, extract, awaitingResponse } = useContext(UserContext);

    const navigate = useNavigate();

    const errorMessageRef = useRef(null);
    const [errorMessageHeight, setErrorMessageHeight] = useState<number>(0);
    const createNewPostButtonRef = useRef(null);
    const [createNewPostButtonHeight, setCreateNewPostButtonHeight] = useState<number>(0);

    const [waiting, setWaiting] = useState(false);

    const [posts, setPosts] = useState<Response>(null);
    const [postsQuantityFromLastRequest, setPostsQuantityFromLastRequest] = useState<number>(0);
    const [response, setParams, setAttempting, gettingPosts] = useAsync.GET<Params, Response>(
        {
            func: getRecommendedPosts,
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
        setPosts((currentPosts) => {
            return currentPosts ? currentPosts.concat(newState || []) : newState || null;
        });
        setPostsQuantityFromLastRequest(newState ? newState.length : 0);
    }, [response]);

    useEffect(() => {
        if (!isScrollable && postsQuantityFromLastRequest > 0 && posts) {
            setAttempting(true);
            setParams([
                {
                    params: {
                        userId: extract("_id") as mongoose.Types.ObjectId | undefined | null,
                        after: posts[posts.length - 1]._id,
                    },
                },
                null,
            ]);
        }
    }, [isScrollable, postsQuantityFromLastRequest, posts, setAttempting, setParams, extract]);

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
        setWaiting(gettingPosts);
    }, [gettingPosts]);

    // subscribe to successful post creation
    useEffect(() => {
        PubSub.unsubscribe("post-creation-successful");
        PubSub.subscribe("post-creation-successful", (msg, data) => {
            if (posts && posts.findIndex((post) => post._id === data.replyingTo) > -1) {
                navigate(`/post/${data.replyingTo}`);
            } else {
                setPosts((oldPosts) => {
                    return oldPosts ? [data, ...oldPosts] : [];
                });
            }
        });

        return () => {
            PubSub.unsubscribe("post-creation-successful");
        };
    }, [posts, navigate]);

    // subscribe to main App component's scroll topic
    useEffect(() => {
        PubSub.unsubscribe("page-scroll-reached-bottom");
        PubSub.subscribe("page-scroll-reached-bottom", () => {
            if (!waiting && posts) {
                setAttempting(true);
                setParams([
                    {
                        params: {
                            userId: extract("_id") as mongoose.Types.ObjectId | undefined | null,
                            after: posts[posts.length - 1]._id,
                        },
                    },
                    null,
                ]);
            }
        });

        return () => {
            PubSub.unsubscribe("page-scroll-reached-bottom");
        };
    }, [extract, posts, setAttempting, setParams, waiting]);

    useEffect(() => {
        let errorMessageRefCurrent: Element;
        let createNewPostButtonRefCurrent: Element;

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

        const createNewPostButtonObserver = new ResizeObserver((entries) => {
            const contentHeight = entries[0].contentRect.height;
            const padding =
                parseFloat(window.getComputedStyle(entries[0].target).paddingTop) +
                parseFloat(window.getComputedStyle(entries[0].target).paddingBottom);
            const totalHeight = contentHeight + padding;
            setCreateNewPostButtonHeight(totalHeight || 0);
        });
        if (createNewPostButtonRef.current) {
            createNewPostButtonRefCurrent = createNewPostButtonRef.current;
            createNewPostButtonObserver.unobserve(createNewPostButtonRef.current);
            createNewPostButtonObserver.observe(createNewPostButtonRef.current);
        }

        return () => {
            if (errorMessageRefCurrent instanceof Element) {
                errorMessageObserver.unobserve(errorMessageRefCurrent);
            }
            if (createNewPostButtonRefCurrent instanceof Element) {
                createNewPostButtonObserver.unobserve(createNewPostButtonRefCurrent);
            }
        };
    }, [posts, errorMessage, errorMessageRef, createNewPostButtonRef]);

    useEffect(() => {
        const publish = () => {
            PubSub.publish("infobar-set-choices", ["RecommendedUsers", "RecentChatActivity"]);
        };

        PubSub.subscribe("infobar-ready", () => publish());
        publish();

        return () => {
            PubSub.unsubscribe("infobar-ready");
        };
    }, []);

    return (
        <div className={styles["container"]}>
            {!(waiting && (!posts || posts.length === 0)) ? (
                <>
                    <div style={{ height: errorMessageHeight }}></div>
                    {posts && posts.length > 0 ? (
                        posts.map((post) => {
                            return (
                                <Posts.Post
                                    _id={post._id}
                                    canReply
                                    skeleton
                                    key={`post-${post._id}`}
                                />
                            );
                        })
                    ) : (
                        <p className={styles["empty-message"]}>
                            {posts && posts.length === 0 ? "Nothing to see here!" : ""}
                        </p>
                    )}
                    <div style={{ height: createNewPostButtonHeight }}></div>
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
                                className={styles["create-new-post-button-container"]}
                                ref={createNewPostButtonRef}
                            >
                                <Buttons.Basic
                                    text="Create New Post"
                                    symbol="stylus_note"
                                    onClickHandler={() => {
                                        PubSub.publish("create-new-post-button-click", null);
                                    }}
                                    palette="blue"
                                    otherStyles={{
                                        fontSize: "1.25rem",
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
