import { useState, useEffect, useContext } from "react";
import mongoose from "mongoose";
import * as useAsync from "@/hooks/useAsync";
import { ProfileContext } from "@/features/profile/Main";
import Posts from "@/features/posts";
import getUserPosts, { Params, Response } from "./utils/getUserPosts";
import styles from "./index.module.css";

function UserPosts() {
    const { _id } = useContext(ProfileContext);

    const [userId, setUserId] = useState<mongoose.Types.ObjectId | null | undefined>(_id);
    const [posts, setPosts] = useState<Response>([]);
    const [response, setParams, setAttempting] = useAsync.GET<Params, Response>(
        {
            func: getUserPosts,
            parameters: [{ params: { userId: _id, after: null } }, null],
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
    }, [userId, setAttempting]);

    if (response && response.status === 401) window.location.assign("/");

    useEffect(() => {
        if (response && response.status >= 400 && response.message && response.message.length > 0) {
            setErrorMessage(response.message);
        }
    }, [response]);

    return (
        <>
            {errorMessage.length > 0 ? (
                <p className={styles["error-message"]}>{errorMessage}</p>
            ) : null}
            {posts
                ? posts.map((post) => {
                      return <Posts.Post _id={post._id} key={`post-self-${post._id}`} />;
                  })
                : null}
        </>
    );
}

export default UserPosts;
