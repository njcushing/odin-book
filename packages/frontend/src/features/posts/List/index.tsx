import { useState, useEffect, useContext } from "react";
import * as useAsync from "@/hooks/useAsync";
import { UserContext } from "@/context/user";
import Buttons from "@/components/buttons";
import PubSub from "pubsub-js";
import mongoose from "mongoose";
import Accessibility from "@/components/accessibility";
import getRecommendedPosts, { Params, Response } from "./utils/getRecommendedPosts";
import Posts from "..";
import styles from "./index.module.css";

function List() {
    const { user, extract } = useContext(UserContext);

    const [waiting, setWaiting] = useState<boolean>(true);

    const [posts, setPosts] = useState<Response>([]);
    const [response, setParams, setAttempting, gettingPosts] = useAsync.GET<Params, Response>(
        {
            func: getRecommendedPosts,
            parameters: [
                {
                    params: {
                        userId: extract("_id") as mongoose.Types.ObjectId | undefined | null,
                        after: null,
                        repliesOnly: false,
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
        setPosts(newState || []);
    }, [response]);

    useEffect(() => {
        setAttempting(true);
        setErrorMessage("");
        setParams([
            {
                params: {
                    userId: extract("_id") as mongoose.Types.ObjectId | undefined | null,
                    after: null,
                    repliesOnly: false,
                },
            },
            null,
        ]);
    }, [user, extract, setParams, setAttempting]);

    if (response && response.status === 401) window.location.assign("/");

    useEffect(() => {
        if (response && response.status >= 400 && response.message && response.message.length > 0) {
            setErrorMessage(response.message);
        }
    }, [response]);

    useEffect(() => {
        setWaiting(gettingPosts);
    }, [gettingPosts]);

    return (
        <div className={styles["container"]}>
            {!waiting ? (
                <>
                    {errorMessage.length > 0 ? (
                        <p className={styles["error-message"]}>{errorMessage}</p>
                    ) : null}
                    {posts && posts.length > 0 ? (
                        posts.map((post) => {
                            return <Posts.Post _id={post._id} canReply key={`post-${post._id}`} />;
                        })
                    ) : (
                        <p className={styles["empty-message"]}>Nothing to see here!</p>
                    )}
                    <div className={styles["create-new-post-button-wrapper"]}>
                        <div className={styles["create-new-post-button-container"]}>
                            <Buttons.Basic
                                text="Create New Post"
                                symbol="stylus_note"
                                onClickHandler={() => {
                                    PubSub.publish("create-new-post-button-click", null);
                                }}
                                palette="blue"
                                otherStyles={{
                                    fontSize: "1.25rem",
                                    padding: "0.8rem 1.6rem",
                                }}
                            />
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
