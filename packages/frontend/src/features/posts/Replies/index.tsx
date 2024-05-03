import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import PubSub from "pubsub-js";
import Accessibility from "@/components/accessibility";
import * as useAsync from "@/hooks/useAsync";
import mongoose from "mongoose";
import * as calculateElementHeight from "@/utils/calculateElementHeight";
import Posts from "..";
import getPostReplies, { Params, Response } from "./utils/getPostReplies";
import styles from "./index.module.css";

type RepliesTypes = {
    _id?: mongoose.Types.ObjectId;
    getIdFromURLParam?: boolean;
    maxRepliesToDisplay?: number;
    numberOfRepliesToLoadOnMount?: number;
    canLoadMoreReplies?: boolean;
    disableRepliesLink?: boolean;
};

function Replies({
    _id,
    getIdFromURLParam = false,
    maxRepliesToDisplay,
    numberOfRepliesToLoadOnMount = 10,
    canLoadMoreReplies = false,
    disableRepliesLink = false,
}: RepliesTypes) {
    const { postId } = useParams();

    const errorMessageRef = useRef(null);
    const [errorMessageHeight, setErrorMessageHeight] = useState<number>(0);

    const [initialWaiting, setInitialWaiting] = useState(true);
    const [waiting, setWaiting] = useState(true);

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
        true,
    );
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const newState = response ? response.data : [];
        setPostReplies((currentPostReplies) => {
            return currentPostReplies ? currentPostReplies.concat(newState || []) : newState || [];
        });
    }, [response]);

    useEffect(() => {
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
    }, [_id, getIdFromURLParam, postId, setParams, setAttempting]);

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

    // subscribe to main App component's scroll topic
    useEffect(() => {
        PubSub.unsubscribe("page-scroll-reached-bottom");
        PubSub.subscribe("page-scroll-reached-bottom", () => {
            if (canLoadMoreReplies && !waiting && postReplies) {
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

        return () => {
            PubSub.unsubscribe("page-scroll-reached-bottom");
        };
    }, [
        postReplies,
        _id,
        getIdFromURLParam,
        postId,
        setAttempting,
        setParams,
        waiting,
        canLoadMoreReplies,
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

    const errorMessageElement =
        errorMessage.length > 0 ? (
            <p className={styles["error-message"]} ref={errorMessageRef}>
                {errorMessage}
            </p>
        ) : (
            <p ref={errorMessageRef}></p>
        );

    return (
        <div className={styles["container"]}>
            {!initialWaiting ? (
                <>
                    <div style={{ height: errorMessageHeight }}></div>
                    <Posts.Post
                        _id={
                            !getIdFromURLParam
                                ? _id
                                : (postId as unknown as mongoose.Types.ObjectId)
                        }
                        getIdFromURLParam
                        canReply
                        disableRepliesLink={disableRepliesLink}
                        size="l"
                    />
                    {postReplies && postReplies.length > 0 ? (
                        <ul className={styles["replies"]}>
                            {postReplies.map((reply, i) => {
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
