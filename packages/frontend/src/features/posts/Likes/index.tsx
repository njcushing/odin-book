import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as useAsync from "@/hooks/useAsync";
import mongoose from "mongoose";
import User from "@/components/user";
import getPostLikes, { Params, Response } from "./utils/getPostLikes";
import styles from "./index.module.css";

type LikesTypes = {
    _id?: mongoose.Types.ObjectId;
    getIdFromURLParam?: boolean;
};

function Likes({ _id, getIdFromURLParam = false }: LikesTypes) {
    const { postId } = useParams();

    const [likes, setLikes] = useState<Response>([]);
    const [response, setParams, setAttempting] = useAsync.GET<Params, Response>(
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
        setLikes(newState || []);
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
                    after: null,
                },
            },
            null,
        ]);
    }, [_id, getIdFromURLParam, postId, setParams, setAttempting]);

    if (response && response.status === 401) window.location.assign("/");

    useEffect(() => {
        if (response && response.status >= 400 && response.message && response.message.length > 0) {
            setErrorMessage(response.message);
        }
    }, [response]);

    return (
        <div className={styles["container"]}>
            {likes ? (
                <a
                    className={styles["return-to-post"]}
                    href={`/post/${!getIdFromURLParam ? _id : postId}`}
                >
                    <p className={`material-symbols-rounded ${styles["return-to-post-arrow"]}`}>
                        arrow_back
                    </p>
                    <p className={styles["return-to-post-text"]}>Return to post...</p>
                </a>
            ) : null}
            {errorMessage.length > 0 ? (
                <p className={styles["error-message"]}>{errorMessage}</p>
            ) : null}
            {likes && likes.length > 0 ? (
                <div className={styles["post-likes"]}>
                    {likes.map((userId) => {
                        return <User.Option _id={userId} key={`post-like-${userId}`} />;
                    })}
                </div>
            ) : (
                <p className={styles["empty-message"]}>Nothing to see here!</p>
            )}
        </div>
    );
}

export default Likes;
