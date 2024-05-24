import { useContext, useState, useEffect, useRef } from "react";
import * as useAsync from "@/hooks/useAsync";
import { AppContext } from "@/App";
import { ProfileContext } from "@/features/profile/Main";
import Posts from "@/features/posts";
import Accessibility from "@/components/accessibility";
import getUserLikes, { Params, Response } from "./utils/getUserLikes";
import styles from "./index.module.css";

function UserLikes() {
    const { isScrollable } = useContext(AppContext);
    const { _id } = useContext(ProfileContext);

    const errorMessageRef = useRef(null);
    const [errorMessageHeight, setErrorMessageHeight] = useState<number>(0);

    const [initialWaiting, setInitialWaiting] = useState(true);
    const [waiting, setWaiting] = useState(true);

    const [likes, setLikes] = useState<Response>([]);
    const [likesQuantityFromLastRequest, setLikesQuantityFromLastRequest] = useState<number>(0);
    const [response, setParams, setAttempting, gettingLikes] = useAsync.GET<Params, Response>(
        {
            func: getUserLikes,
            parameters: [{ params: { userId: _id, after: null } }, null],
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
            setParams([{ params: { userId: _id, after: likes[likes.length - 1]._id } }, null]);
        }
    }, [isScrollable, likesQuantityFromLastRequest, likes, _id, setAttempting, setParams]);

    useEffect(() => {
        setAttempting(true);
        setErrorMessage("");
        setParams([{ params: { userId: _id, after: null } }, null]);
    }, [_id, setParams, setAttempting]);

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
                setParams([{ params: { userId: _id, after: likes[likes.length - 1]._id } }, null]);
            }
        });

        return () => {
            PubSub.unsubscribe("page-scroll-reached-bottom");
        };
    }, [likes, _id, setAttempting, setParams, waiting]);

    useEffect(() => {
        let errorMessageRefCurrent: Element;

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

        return () => {
            if (errorMessageRefCurrent instanceof Element) {
                errorMessageObserver.unobserve(errorMessageRefCurrent);
            }
        };
    }, [likes, errorMessage, errorMessageRef]);

    return (
        <div className={styles["container"]}>
            {!initialWaiting ? (
                <>
                    <div style={{ height: errorMessageHeight }}></div>
                    {likes && likes.length > 0 ? (
                        likes.map((like) => {
                            return <Posts.Post _id={like._id} key={`post-like-${like._id}`} />;
                        })
                    ) : (
                        <p className={styles["empty-message"]}>Nothing to see here!</p>
                    )}
                    <div className={styles["sticky-wrapper"]}>
                        <div className={styles["sticky-container"]}>
                            {errorMessage.length > 0 ? (
                                <p className={styles["error-message"]} ref={errorMessageRef}>
                                    {errorMessage}
                                </p>
                            ) : (
                                <p ref={errorMessageRef}></p>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <Accessibility.WaitingWheel />
            )}
        </div>
    );
}

export default UserLikes;
