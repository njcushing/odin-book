import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "@/context/user";
import * as useAsync from "@/hooks/useAsync";
import * as extendedTypes from "@shared/utils/extendedTypes";
import Accessibility from "@/components/accessibility";
import getRecommendedPosts, {
    Params,
    Response,
} from "@/features/posts/List/utils/getRecommendedPosts";
import RecentPost from "./components/RecentPost";
import styles from "./index.module.css";

export type TRecentPosts = {
    style?: React.CSSProperties;
};

function RecentPosts({ style }: TRecentPosts) {
    const { user, extract, awaitingResponse } = useContext(UserContext);

    const [waiting, setWaiting] = useState(false);

    const [posts, setPosts] = useState<Response>(null);
    const [response, setParams, setAttempting, creatingMessage] = useAsync.GET<Params, Response>(
        {
            func: getRecommendedPosts,
            parameters: [
                {
                    params: {
                        userId: extract("_id") as extendedTypes.MongooseObjectId | undefined | null,
                        excludeActiveUser: true,
                        limit: 3,
                    },
                },
                null,
            ],
        },
        false,
    );
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const newState = response ? response.data : null;
        setPosts(() => newState);
    }, [response]);

    useEffect(() => {
        if (!awaitingResponse) {
            setAttempting(true);
            setErrorMessage("");
            setParams([
                {
                    params: {
                        userId: extract("_id") as extendedTypes.MongooseObjectId | undefined | null,
                        excludeActiveUser: true,
                        limit: 3,
                    },
                },
                null,
            ]);
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
        setWaiting(creatingMessage);
    }, [creatingMessage]);

    return (
        <div className={styles["container"]} style={style}>
            <h4 className={styles["title"]}>Recent Posts</h4>
            {!(waiting && (!posts || posts.length === 0)) ? (
                <>
                    {posts && posts.length > 0 ? (
                        <ul className={styles["post-list"]}>
                            {posts.map((postData) => {
                                const { _id } = postData;

                                return (
                                    <RecentPost
                                        _id={_id}
                                        skeleton
                                        key={`infobar-recent-posts-${_id}`}
                                    />
                                );
                            })}
                        </ul>
                    ) : (
                        <p className={styles["no-posts-message"]}>
                            {posts && posts.length === 0
                                ? "There are no recent posts to display right now."
                                : ""}
                        </p>
                    )}
                    {errorMessage.length > 0 ? (
                        <p className={styles["error-message"]}>{errorMessage}</p>
                    ) : null}
                </>
            ) : (
                <Accessibility.WaitingWheel />
            )}
        </div>
    );
}

export default RecentPosts;
