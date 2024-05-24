import { useContext, useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as useAsync from "@/hooks/useAsync";
import { AppContext } from "@/App";
import mongoose from "mongoose";
import User from "@/components/user";
import Accessibility from "@/components/accessibility";
import * as calculateElementHeight from "@/utils/calculateElementHeight";
import getPostLikes, { Params, Response } from "./utils/getPostLikes";
import styles from "./index.module.css";

type LikesTypes = {
    _id?: mongoose.Types.ObjectId;
    getIdFromURLParam?: boolean;
};

function Likes({ _id, getIdFromURLParam = false }: LikesTypes) {
    const { isScrollable } = useContext(AppContext);

    const { postId } = useParams();

    const navigate = useNavigate();

    const errorMessageRef = useRef(null);
    const [errorMessageHeight, setErrorMessageHeight] = useState<number>(0);
    const returnToPostButtonRef = useRef(null);
    const [returnToPostButtonHeight, setReturnToPostButtonHeight] = useState<number>(0);

    const [initialWaiting, setInitialWaiting] = useState(true);
    const [waiting, setWaiting] = useState(true);

    const [likes, setLikes] = useState<Response>([]);
    const [likesQuantityFromLastRequest, setLikesQuantityFromLastRequest] = useState<number>(0);
    const [response, setParams, setAttempting, gettingLikes] = useAsync.GET<Params, Response>(
        {
            func: getPostLikes,
            parameters: [
                {
                    params: {
                        postId: !getIdFromURLParam
                            ? _id
                            : (postId as unknown as mongoose.Types.ObjectId),
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
        setLikes((currentLikes) => {
            return currentLikes ? currentLikes.concat(newState || []) : newState || [];
        });
        setLikesQuantityFromLastRequest(newState ? newState.length : 0);
    }, [response]);

    useEffect(() => {
        if (!isScrollable && likesQuantityFromLastRequest > 0 && likes) {
            setAttempting(true);
            setParams([
                {
                    params: {
                        postId: !getIdFromURLParam
                            ? _id
                            : (postId as unknown as mongoose.Types.ObjectId),
                        after: likes[likes.length - 1],
                    },
                },
                null,
            ]);
        }
    }, [
        isScrollable,
        likesQuantityFromLastRequest,
        likes,
        _id,
        getIdFromURLParam,
        postId,
        setAttempting,
        setParams,
    ]);

    useEffect(() => {
        setAttempting(true);
        setErrorMessage("");
        setParams([
            {
                params: {
                    postId: !getIdFromURLParam
                        ? _id
                        : (postId as unknown as mongoose.Types.ObjectId),
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
        if (!gettingLikes) setInitialWaiting(gettingLikes);
        setWaiting(gettingLikes);
    }, [gettingLikes]);

    // subscribe to main App component's scroll topic
    useEffect(() => {
        PubSub.unsubscribe("page-scroll-reached-bottom");
        PubSub.subscribe("page-scroll-reached-bottom", () => {
            if (!waiting && likes) {
                setAttempting(true);
                setParams([
                    {
                        params: {
                            postId: !getIdFromURLParam
                                ? _id
                                : (postId as unknown as mongoose.Types.ObjectId),
                            after: likes[likes.length - 1],
                        },
                    },
                    null,
                ]);
            }
        });

        return () => {
            PubSub.unsubscribe("page-scroll-reached-bottom");
        };
    }, [likes, _id, getIdFromURLParam, postId, setAttempting, setParams, waiting]);

    useEffect(() => {
        let errorMessageRefCurrent: Element;
        let returnToPostButtonRefCurrent: Element;

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

        const returnToPostButtonObserver = new ResizeObserver((entries) => {
            calculateElementHeight.fromResizeObserverEntry(entries[0], setReturnToPostButtonHeight);
        });
        if (returnToPostButtonRef.current) {
            returnToPostButtonRefCurrent = returnToPostButtonRef.current;
            calculateElementHeight.fromElement(
                returnToPostButtonRefCurrent,
                setReturnToPostButtonHeight,
            );
            returnToPostButtonObserver.unobserve(returnToPostButtonRef.current);
            returnToPostButtonObserver.observe(returnToPostButtonRef.current);
        }

        return () => {
            if (errorMessageRefCurrent instanceof Element) {
                errorMessageObserver.unobserve(errorMessageRefCurrent);
            }
            if (returnToPostButtonRefCurrent instanceof Element) {
                returnToPostButtonObserver.unobserve(returnToPostButtonRefCurrent);
            }
        };
    }, [likes, waiting, initialWaiting, errorMessageRef, returnToPostButtonRef]);

    useEffect(() => {
        const publish = () => {
            PubSub.publish("infobar-set-choices", [
                "RecommendedUsers",
                "RecentPosts",
                "RecentChatActivity",
            ]);
        };

        PubSub.subscribe("infobar-ready", () => publish());
        publish();

        return () => {
            PubSub.unsubscribe("infobar-ready");
        };
    }, []);

    const errorMessageElement =
        errorMessage.length > 0 ? (
            <p className={styles["error-message"]} ref={errorMessageRef}>
                {errorMessage}
            </p>
        ) : (
            <p ref={errorMessageRef}></p>
        );

    const returnToPostButtonElement = (
        <div className={styles["return-to-post-button-container"]} ref={returnToPostButtonRef}>
            <button
                type="button"
                className={styles["return-to-post-button"]}
                onClick={(e) => {
                    navigate(`/post/${!getIdFromURLParam ? _id : postId}`);
                    e.currentTarget.blur();
                    e.preventDefault();
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.blur();
                }}
            >
                <p className={`material-symbols-rounded ${styles["return-to-post-arrow"]}`}>
                    arrow_back
                </p>
                <p className={styles["return-to-post-text"]}>Return to post...</p>
            </button>
        </div>
    );

    return (
        <div className={styles["container"]}>
            {!initialWaiting ? (
                <>
                    <div style={{ height: errorMessageHeight }}></div>
                    <div style={{ height: returnToPostButtonHeight }}></div>
                    {likes && likes.length > 0 ? (
                        <div className={styles["post-likes"]}>
                            {likes.map((userId) => {
                                return (
                                    <User.Option
                                        _id={userId}
                                        skeleton
                                        key={`post-like-${userId}`}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <p className={styles["empty-message"]}>Nothing to see here!</p>
                    )}
                    <div className={styles["sticky-wrapper"]}>
                        <div className={styles["sticky-container"]}>
                            {errorMessageElement}
                            {likes ? returnToPostButtonElement : null}
                        </div>
                    </div>
                </>
            ) : (
                <Accessibility.WaitingWheel />
            )}
        </div>
    );
}

export default Likes;
