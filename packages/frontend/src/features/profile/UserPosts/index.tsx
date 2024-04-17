import { useState, useEffect, useContext } from "react";
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
        setPosts(newState || []);
    }, [response]);

    useEffect(() => {
        setAttempting(true);
        setErrorMessage("");
        setParams([{ params: { userId: _id, after: null, repliesOnly } }, null]);
    }, [_id, repliesOnly, setParams, setAttempting]);

    if (response && response.status === 401) window.location.assign("/");

    useEffect(() => {
        if (response && response.status >= 400 && response.message && response.message.length > 0) {
            setErrorMessage(response.message);
        }
    }, [response]);

    useEffect(() => {
        setWaiting(gettingPosts);
    }, [gettingPosts]);

    return !waiting ? (
        <>
            {errorMessage.length > 0 ? (
                <p className={styles["error-message"]}>{errorMessage}</p>
            ) : null}
            {posts && posts.length > 0 ? (
                posts.map((post) => {
                    return (
                        <Posts.Post
                            _id={repliesOnly && post.replyingTo ? post.replyingTo : post._id}
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
        </>
    ) : (
        <Accessibility.WaitingWheel />
    );
}

export default UserPosts;
