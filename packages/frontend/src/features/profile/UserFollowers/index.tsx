import { useContext, useState, useEffect, useRef } from "react";
import * as useAsync from "@/hooks/useAsync";
import { AppContext } from "@/App";
import { ProfileContext } from "@/features/profile/Main";
import User from "@/components/user";
import Accessibility from "@/components/accessibility";
import getUserFollowers, { Params, Response } from "./utils/getUserFollowers";
import styles from "./index.module.css";

function UserFollowers() {
    const { isScrollable } = useContext(AppContext);
    const { _id } = useContext(ProfileContext);

    const errorMessageRef = useRef(null);
    const [errorMessageHeight, setErrorMessageHeight] = useState<number>(0);

    const [initialWaiting, setInitialWaiting] = useState(true);
    const [waiting, setWaiting] = useState(true);

    const [followers, setFollowers] = useState<Response>([]);
    const [followersQuantityFromLastRequest, setFollowersQuantityFromLastRequest] =
        useState<number>(0);
    const [response, setParams, setAttempting, gettingFollowers] = useAsync.GET<Params, Response>(
        {
            func: getUserFollowers,
            parameters: [{ params: { userId: _id, after: null } }, null],
        },
        true,
    );
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const newState = response ? response.data : [];
        setFollowers((currentFollowers) => {
            return currentFollowers ? currentFollowers.concat(newState || []) : newState || [];
        });
        setFollowersQuantityFromLastRequest(newState ? newState.length : 0);
    }, [response]);

    useEffect(() => {
        if (!isScrollable && followersQuantityFromLastRequest > 0 && followers) {
            setAttempting(true);
            setParams([{ params: { userId: _id, after: followers[followers.length - 1] } }, null]);
        }
    }, [isScrollable, followersQuantityFromLastRequest, followers, _id, setAttempting, setParams]);

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
        if (!gettingFollowers) setInitialWaiting(gettingFollowers);
        setWaiting(gettingFollowers);
    }, [gettingFollowers]);

    // subscribe to main App component's scroll topic
    useEffect(() => {
        PubSub.unsubscribe("page-scroll-reached-bottom");
        PubSub.subscribe("page-scroll-reached-bottom", () => {
            if (!waiting && followers) {
                setAttempting(true);
                setParams([
                    { params: { userId: _id, after: followers[followers.length - 1] } },
                    null,
                ]);
            }
        });

        return () => {
            PubSub.unsubscribe("page-scroll-reached-bottom");
        };
    }, [followers, _id, setAttempting, setParams, waiting]);

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
    }, [followers, errorMessage, errorMessageRef]);

    return (
        <div className={styles["container"]}>
            {!initialWaiting ? (
                <>
                    <div style={{ height: errorMessageHeight }}></div>
                    {followers && followers.length > 0 ? (
                        <div className={styles["followers"]}>
                            {followers.map((userId) => {
                                return (
                                    <User.Option _id={userId} skeleton key={`follower-${userId}`} />
                                );
                            })}
                        </div>
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

export default UserFollowers;
