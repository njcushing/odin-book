import { useContext, useState, useEffect, useRef } from "react";
import * as useAsync from "@/hooks/useAsync";
import { ProfileContext } from "@/features/profile/Main";
import Posts from "@/features/posts";
import Accessibility from "@/components/accessibility";
import getUserPosts, { Params, Response } from "./utils/getUserPosts";
import styles from "./index.module.css";

export type UserPostsTypes = {
    repliesOnly?: boolean;
};

function UserPosts({ repliesOnly = false }: UserPostsTypes) {
    const { _id } = useContext(ProfileContext);

    const errorMessageRef = useRef(null);
    const [errorMessageHeight, setErrorMessageHeight] = useState<number>(0);

    const [initialWaiting, setInitialWaiting] = useState(true);
    const [waiting, setWaiting] = useState(true);

    const [posts, setPosts] = useState<Response>([]);
    const [response, setParams, setAttempting, gettingPosts] = useAsync.GET<Params, Response>(
        {
            func: getUserPosts,
            parameters: [{ params: { userId: _id, after: null, repliesOnly } }, null],
        },
        true,
    );
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const newState = response ? response.data : [];
        setPosts((currentPosts) => {
            return currentPosts ? currentPosts.concat(newState || []) : newState || [];
        });
    }, [response]);

    useEffect(() => {
        setAttempting(true);
        setErrorMessage("");
        setParams([{ params: { userId: _id, after: null, repliesOnly } }, null]);
    }, [_id, repliesOnly, setParams, setAttempting]);

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
        if (!gettingPosts) setInitialWaiting(gettingPosts);
        setWaiting(gettingPosts);
    }, [gettingPosts]);

    // subscribe to main App component's scroll topic
    useEffect(() => {
        PubSub.unsubscribe("page-scroll-reached-bottom");
        PubSub.subscribe("page-scroll-reached-bottom", () => {
            if (!waiting && posts) {
                setAttempting(true);
                setParams([
                    { params: { userId: _id, after: posts[posts.length - 1]._id, repliesOnly } },
                    null,
                ]);
            }
        });

        return () => {
            PubSub.unsubscribe("page-scroll-reached-bottom");
        };
    }, [posts, _id, repliesOnly, setAttempting, setParams, waiting]);

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
    }, [posts, errorMessage, errorMessageRef]);

    return (
        <div className={styles["container"]}>
            {!initialWaiting ? (
                <>
                    <div style={{ height: errorMessageHeight }}></div>
                    {posts && posts.length > 0 ? (
                        posts.map((post) => {
                            return (
                                <Posts.Post
                                    _id={
                                        repliesOnly && post.replyingTo ? post.replyingTo : post._id
                                    }
                                    overrideReplies={repliesOnly ? [post._id] : []}
                                    viewingDefault={repliesOnly ? "replies" : ""}
                                    removeSeeMoreRepliesButton={repliesOnly}
                                    key={`post-self-${post._id}`}
                                />
                            );
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
                                <p></p>
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

export default UserPosts;
