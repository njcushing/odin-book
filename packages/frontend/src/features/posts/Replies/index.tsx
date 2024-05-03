import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PubSub from "pubsub-js";
import Accessibility from "@/components/accessibility";
import * as useAsync from "@/hooks/useAsync";
import mongoose from "mongoose";
import * as calculateElementHeight from "@/utils/calculateElementHeight";
import { v4 as uuidv4 } from "uuid";
import Posts from "..";
import getPostReplies, { Params, Response } from "./utils/getPostReplies";
import styles from "./index.module.css";

type RepliesTypes = {
    _id?: mongoose.Types.ObjectId;
    overrideReplies?: mongoose.Types.ObjectId[];
    getIdFromURLParam?: boolean;
    maxRepliesToDisplay?: number;
    numberOfRepliesToLoadOnMount?: number;
    canLoadMoreReplies?: boolean;
    disableRepliesLink?: boolean;
};

function Replies({
    _id,
    overrideReplies,
    getIdFromURLParam = false,
    maxRepliesToDisplay,
    numberOfRepliesToLoadOnMount = 10,
    canLoadMoreReplies = false,
    disableRepliesLink = false,
}: RepliesTypes) {
    const { postId } = useParams();

    const navigate = useNavigate();

    const errorMessageRef = useRef(null);
    const [errorMessageHeight, setErrorMessageHeight] = useState<number>(0);

    const [initialWaiting, setInitialWaiting] = useState(!overrideReplies);
    const [waiting, setWaiting] = useState(!overrideReplies);

    const [postReplies, setPostReplies] = useState<Response>([]);
    const [response, setParams, setAttempting, gettingPostReplies] = useAsync.GET<Params, Response>(
        {
            func: getPostReplies,
            parameters: [
                {
                    params: {
                        postId: !getIdFromURLParam
                            ? _id
                            : (postId as unknown as mongoose.Types.ObjectId),
                        limit: numberOfRepliesToLoadOnMount,
                        after: null,
                    },
                },
                null,
            ],
        },
        !overrideReplies,
    );
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const newState = response ? response.data : [];
        setPostReplies((currentPostReplies) => {
            return currentPostReplies ? currentPostReplies.concat(newState || []) : newState || [];
        });
    }, [response]);

    useEffect(() => {
        if (!overrideReplies) {
            setAttempting(true);
            setErrorMessage("");
            setParams([
                {
                    params: {
                        postId: !getIdFromURLParam
                            ? _id
                            : (postId as unknown as mongoose.Types.ObjectId),
                        limit: undefined,
                        after: null,
                    },
                },
                null,
            ]);
        }
    }, [overrideReplies, _id, getIdFromURLParam, postId, setParams, setAttempting]);

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
        if (!gettingPostReplies) setInitialWaiting(gettingPostReplies);
        setWaiting(gettingPostReplies);
    }, [gettingPostReplies]);

    // subscribe to successful post creation
    useEffect(() => {
        PubSub.subscribe("post-creation-successful", (msg, data) => {
            if (!getIdFromURLParam ? _id : postId === data.replyingTo) {
                setPostReplies((oldPostReplies) => {
                    return oldPostReplies ? [data._id, ...oldPostReplies] : [];
                });
            } else if (postReplies && postReplies.includes(data.replyingTo)) {
                navigate(`/post/${data.replyingTo}`);
            }
        });

        return () => {
            PubSub.unsubscribe("post-creation-successful");
        };
    }, [_id, getIdFromURLParam, postId, postReplies, navigate]);

    // subscribe to main App component's scroll topic
    useEffect(() => {
        let unmountFunc = () => {};

        if (canLoadMoreReplies) {
            PubSub.unsubscribe("page-scroll-reached-bottom");
            PubSub.subscribe("page-scroll-reached-bottom", () => {
                if (!overrideReplies && canLoadMoreReplies && !waiting && postReplies) {
                    setAttempting(true);
                    setParams([
                        {
                            params: {
                                postId: !getIdFromURLParam
                                    ? _id
                                    : (postId as unknown as mongoose.Types.ObjectId),
                                limit: undefined,
                                after: postReplies[postReplies.length - 1],
                            },
                        },
                        null,
                    ]);
                }
            });

            unmountFunc = () => {
                PubSub.unsubscribe("page-scroll-reached-bottom");
            };
        }

        return unmountFunc;
    }, [
        overrideReplies,
        canLoadMoreReplies,
        postReplies,
        _id,
        getIdFromURLParam,
        postId,
        setAttempting,
        setParams,
        waiting,
    ]);

    useEffect(() => {
        let errorMessageRefCurrent: Element;

        const errorMessageObserver = new ResizeObserver((entries) => {
            const totalHeight = calculateElementHeight.fromResizeObserverEntry(
                entries[0],
                setErrorMessageHeight,
            );
            PubSub.publish("page-scrollable-area-shift-down", totalHeight);
        });
        if (errorMessageRef.current) {
            errorMessageRefCurrent = errorMessageRef.current;
            calculateElementHeight.fromElement(errorMessageRefCurrent, setErrorMessageHeight);
            errorMessageObserver.unobserve(errorMessageRef.current);
            errorMessageObserver.observe(errorMessageRef.current);
        }

        return () => {
            if (errorMessageRefCurrent instanceof Element) {
                errorMessageObserver.unobserve(errorMessageRefCurrent);
            }
        };
    }, [postReplies, waiting, initialWaiting, errorMessageRef]);

    // reset component on URL route change
    const [generateKey, setGenerateKey] = useState<string>(uuidv4());
    useEffect(() => {
        if (getIdFromURLParam) {
            setGenerateKey(uuidv4());
            setPostReplies([]);
            setAttempting(true);
            setErrorMessage("");
            setParams([
                {
                    params: {
                        postId: postId as unknown as mongoose.Types.ObjectId,
                        limit: numberOfRepliesToLoadOnMount,
                        after: null,
                    },
                },
                null,
            ]);
        }
    }, [getIdFromURLParam, postId, numberOfRepliesToLoadOnMount, setAttempting, setParams]);

    const errorMessageElement =
        errorMessage.length > 0 ? (
            <p className={styles["error-message"]} ref={errorMessageRef}>
                {errorMessage}
            </p>
        ) : (
            <p ref={errorMessageRef}></p>
        );

    const repliesToDisplay = overrideReplies || postReplies;

    return (
        <div className={styles["container"]} key={generateKey}>
            {!initialWaiting ? (
                <>
                    <div style={{ height: errorMessageHeight }}></div>
                    <Posts.Post
                        _id={
                            !getIdFromURLParam
                                ? _id
                                : (postId as unknown as mongoose.Types.ObjectId)
                        }
                        canReply
                        disableRepliesLink={disableRepliesLink}
                        size="l"
                    />
                    {repliesToDisplay && repliesToDisplay.length > 0 ? (
                        <ul className={styles["replies"]}>
                            {repliesToDisplay.map((reply, i) => {
                                if (maxRepliesToDisplay && i >= maxRepliesToDisplay) return null;
                                return (
                                    <li className={styles["reply"]} key={reply.toString()}>
                                        <Posts.Post
                                            _id={reply}
                                            canReply
                                            removeLinkToReply
                                            size="s"
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                    ) : null}
                    <div className={styles["sticky-wrapper"]}>
                        <div className={styles["sticky-container"]}>{errorMessageElement}</div>
                    </div>
                </>
            ) : (
                <Accessibility.WaitingWheel />
            )}
        </div>
    );
}

export default Replies;
