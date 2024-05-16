import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Images from "@/components/images";
import Accessibility from "@/components/accessibility";
import * as useAsync from "@/hooks/useAsync";
import mongoose from "mongoose";
import getPost, { Params, Response } from "@/features/posts/Post/utils/getPost";
import createMultilineTextTruncateStyles from "@/utils/createMultilineTextTruncateStyles";
import styles from "./index.module.css";

type TRecentPost = {
    _id?: mongoose.Types.ObjectId;
    skeleton?: boolean;
};

function RecentPost({ _id, skeleton = true }: TRecentPost) {
    const navigate = useNavigate();

    const [waiting, setWaiting] = useState(true);

    const [postData, setPostData] = useState<Response>(null);

    // get post api handling
    const [getPostResponse /* setGetPostParams */ /* getPostAgain */, , , gettingPost] =
        useAsync.GET<Params, Response>(
            { func: getPost, parameters: [{ params: { postId: _id } }, null] },
            true,
        );
    useEffect(() => {
        const newState = getPostResponse ? getPostResponse.data : null;
        setPostData(newState);
    }, [getPostResponse]);

    // error message handling
    const [errorMessage, setErrorMessage] = useState<string>("");
    useEffect(() => {
        if (getPostResponse) {
            if (
                getPostResponse.status >= 400 &&
                getPostResponse.message &&
                getPostResponse.message.length > 0
            ) {
                setErrorMessage(getPostResponse.message);
            } else {
                setErrorMessage("");
            }
        }
    }, [getPostResponse]);

    useEffect(() => {
        setWaiting(gettingPost);
    }, [gettingPost]);

    const errorMessageElement =
        errorMessage.length > 0 ? <p className={styles["error-message"]}>{errorMessage}</p> : null;

    let username = "User";
    if (postData) {
        if (postData.author.preferences.displayName) {
            username = postData.author.preferences.displayName;
        } else {
            username = postData.author.accountTag;
        }
    }

    let text = "";
    if (postData) {
        if (postData.text) {
            text = postData.text;
        } else {
            text = `${postData.images.length} images`;
        }
    } else if (waiting) {
        text = "placeholder";
    }

    return (
        <div className={styles["wrapper"]}>
            {errorMessageElement}
            {skeleton || postData ? (
                <button
                    type="button"
                    className={styles["container"]}
                    onClick={(e) => {
                        navigate(`/post/${_id}`);
                        e.currentTarget.blur();
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.blur();
                    }}
                    data-waiting={!!waiting}
                >
                    <Accessibility.Skeleton waiting={waiting} style={{ borderRadius: "9999px" }}>
                        {postData && postData.author.preferences.profileImage ? (
                            <Images.Profile
                                src={postData.author.preferences.profileImage.url}
                                alt={postData.author.preferences.profileImage.alt}
                                sizePx={48}
                            />
                        ) : (
                            <Images.Profile sizePx={48} />
                        )}
                    </Accessibility.Skeleton>
                    <div className={styles["content-container"]}>
                        <Accessibility.Skeleton waiting={waiting} style={{ width: "100%" }}>
                            <p className={`truncate-ellipsis ${styles["name"]}`}>{username}</p>
                        </Accessibility.Skeleton>
                        {text.length > 0 ? (
                            <Accessibility.Skeleton waiting={waiting} style={{ width: "100%" }}>
                                <p
                                    className={styles["text"]}
                                    style={{ ...createMultilineTextTruncateStyles(2) }}
                                >
                                    {text}
                                </p>
                            </Accessibility.Skeleton>
                        ) : null}
                    </div>
                </button>
            ) : null}
        </div>
    );
}

export default RecentPost;
