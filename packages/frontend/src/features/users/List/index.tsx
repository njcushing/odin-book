import { useContext, useState, useEffect, useRef } from "react";
import * as useAsync from "@/hooks/useAsync";
import { UserContext } from "@/context/user";
import PubSub from "pubsub-js";
import Accessibility from "@/components/accessibility";
import User from "@/components/user";
import getAllUsers, { Params, Response } from "./utils/getAllUsers";
import styles from "./index.module.css";

function List() {
    const { user, extract, awaitingResponse } = useContext(UserContext);

    const errorMessageRef = useRef(null);
    const [errorMessageHeight, setErrorMessageHeight] = useState<number>(0);

    const [waiting, setWaiting] = useState(false);

    const [users, setUsers] = useState<Response>(null);
    const [response, setParams, setAttempting, gettingPosts] = useAsync.GET<Params, Response>(
        {
            func: getAllUsers,
            parameters: [{ params: { excludeActiveUser: true, after: null } }, null],
        },
        false,
    );
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const newState = response ? response.data : null;
        setUsers((currentUsers) => {
            return currentUsers ? currentUsers.concat(newState || []) : newState || null;
        });
    }, [response]);

    useEffect(() => {
        if (!awaitingResponse) {
            setAttempting(true);
            setErrorMessage("");
            setParams([{ params: { excludeActiveUser: true, after: null } }, null]);
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

    // subscribe to main App component's scroll topic
    useEffect(() => {
        PubSub.unsubscribe("page-scroll-reached-bottom");
        PubSub.subscribe("page-scroll-reached-bottom", () => {
            if (!waiting && users) {
                setAttempting(true);
                setParams([
                    { params: { excludeActiveUser: true, after: users[users.length - 1] } },
                    null,
                ]);
            }
        });

        return () => {
            PubSub.unsubscribe("page-scroll-reached-bottom");
        };
    }, [extract, users, setAttempting, setParams, waiting]);

    useEffect(() => {
        let errorMessageRefCurrent: Element;

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

        return () => {
            if (errorMessageRefCurrent instanceof Element) {
                errorMessageObserver.unobserve(errorMessageRefCurrent);
            }
        };
    }, [users, errorMessage, errorMessageRef]);

    useEffect(() => {
        const publish = () => {
            PubSub.publish("infobar-set-choices", ["RecentPosts", "RecentChatActivity"]);
        };

        PubSub.subscribe("infobar-ready", () => publish());
        publish();

        return () => {
            PubSub.unsubscribe("infobar-ready");
        };
    }, []);

    return (
        <div className={styles["container"]}>
            {!(waiting && (!users || users.length === 0)) ? (
                <>
                    <div style={{ height: errorMessageHeight }}></div>
                    {users && users.length > 0 ? (
                        <div className={styles["users"]}>
                            {users.map((userId) => {
                                return <User.Option _id={userId} skeleton key={`user-${userId}`} />;
                            })}
                        </div>
                    ) : (
                        <p className={styles["empty-message"]}>
                            {users && users.length === 0 ? "Nothing to see here!" : ""}
                        </p>
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

export default List;
