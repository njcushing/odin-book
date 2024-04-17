import { useState, useEffect, useContext } from "react";
import * as useAsync from "@/hooks/useAsync";
import { ProfileContext } from "@/features/profile/Main";
import Posts from "@/features/posts";
import Accessibility from "@/components/accessibility";
import getUserLikes, { Params, Response } from "./utils/getUserLikes";
import styles from "./index.module.css";

function UserLikes() {
    const { _id } = useContext(ProfileContext);

    const [waiting, setWaiting] = useState<boolean>(true);

    const [likes, setLikes] = useState<Response>([]);
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
        setLikes(newState || []);
    }, [response]);

    useEffect(() => {
        setAttempting(true);
        setErrorMessage("");
        setParams([{ params: { userId: _id, after: null } }, null]);
    }, [_id, setParams, setAttempting]);

    if (response && response.status === 401) window.location.assign("/");

    useEffect(() => {
        if (response && response.status >= 400 && response.message && response.message.length > 0) {
            setErrorMessage(response.message);
        } else {
            setErrorMessage("");
        }
    }, [response]);

    useEffect(() => {
        setWaiting(gettingLikes);
    }, [gettingLikes]);

    return !waiting ? (
        <>
            {errorMessage.length > 0 ? (
                <p className={styles["error-message"]}>{errorMessage}</p>
            ) : null}
            {likes && likes.length > 0 ? (
                likes.map((like) => {
                    return <Posts.Post _id={like._id} key={`post-like-${like._id}`} />;
                })
            ) : (
                <p className={styles["empty-message"]}>Nothing to see here!</p>
            )}
        </>
    ) : (
        <Accessibility.WaitingWheel />
    );
}

export default UserLikes;
