import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PubSub from "pubsub-js";
import Buttons from "@/components/buttons";
import User from "@/components/user";
import Images from "@/components/images";
import Accessibility from "@/components/accessibility";
import formatNumber from "@/utils/formatNumber";
import * as useAsync from "@/hooks/useAsync";
import mongoose from "mongoose";
import Posts from "..";
import getPost, { Params as GetPostParams, Response as GetPostResponse } from "./utils/getPost";
import getPostReplies, {
    Params as GetPostRepliesParams,
    Response as GetPostRepliesResponse,
} from "./utils/getPostReplies";
import likePost, { Params as LikePostParams } from "./utils/likePost";
import styles from "./index.module.css";

type PostTypes = {
    _id?: mongoose.Types.ObjectId;
    getIdFromURLParam?: boolean;
    overridePostData?: GetPostResponse;
    viewingDefault?: "" | "replies";
    canToggleReplies?: boolean;
    maxRepliesToDisplay?: number;
    overrideReplies?: GetPostRepliesResponse;
    canReply?: boolean;
    removeSeeMoreRepliesButton?: boolean;
    removeLinkToReply?: boolean;
    disableRepliesLink?: boolean;
    disableLikesLink?: boolean;
    previewMode?: boolean;
    skeleton?: boolean;
    size?: "s" | "l";
};

function Post({
    _id,
    getIdFromURLParam = false,
    overridePostData,
    viewingDefault = "",
    canToggleReplies = false,
    maxRepliesToDisplay = 10,
    overrideReplies = null,
    canReply = false,
    removeSeeMoreRepliesButton = false,
    removeLinkToReply = false,
    disableRepliesLink = false,
    disableLikesLink = false,
    previewMode = false,
    skeleton = true,
    size = "l",
}: PostTypes) {
    const [postData, setPostData] = useState<GetPostResponse>(null);
    const [postReplies, setPostReplies] = useState<GetPostRepliesResponse>(overrideReplies || null);
    const [viewing, setViewing] = useState<"" | "replies">(!previewMode ? viewingDefault : "");
    const [waiting, setWaiting] = useState<boolean>(true);

    const { postId } = useParams();

    const navigate = useNavigate();

    // get post api handling
    const [getPostResponse /* setGetPostParams */, , getPostAgain, gettingPost] = useAsync.GET<
        GetPostParams,
        GetPostResponse
    >(
        {
            func: getPost,
            parameters: [
                {
                    params: {
                        postId: !getIdFromURLParam
                            ? _id
                            : (postId as unknown as mongoose.Types.ObjectId),
                    },
                },
                null,
            ],
        },
        !overridePostData,
    );
    useEffect(() => {
        const newState = getPostResponse ? getPostResponse.data : null;
        setPostData(newState);
    }, [getPostResponse]);

    // get post replies api handling
    const [getPostRepliesResponse /* getPostRepliesParams */, , getPostRepliesAgain] = useAsync.GET<
        GetPostRepliesParams,
        GetPostRepliesResponse
    >(
        {
            func: getPostReplies,
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
        viewing === "replies" && !overrideReplies,
    );
    useEffect(() => {
        const newState = getPostRepliesResponse ? getPostRepliesResponse.data : null;
        setPostReplies(newState);
    }, [getPostRepliesResponse]);

    // like post api handling
    const [likePostResponse /* setLikePostParams */, , likePostAgain] = useAsync.PUT<
        LikePostParams,
        null,
        null
    >(
        {
            func: likePost,
            parameters: [
                {
                    params: {
                        postId: !getIdFromURLParam
                            ? _id
                            : (postId as unknown as mongoose.Types.ObjectId),
                    },
                },
                null,
            ],
        },
        false,
    );

    // error message handling
    const [errorMessage, setErrorMessage] = useState<string>("");
    useEffect(() => {
        if (
            getPostResponse &&
            getPostResponse.status >= 400 &&
            getPostResponse.message &&
            getPostResponse.message.length > 0
        ) {
            setErrorMessage(getPostResponse.message);
        }
    }, [getPostResponse]);

    // fetch post again
    useEffect(() => {
        if (overridePostData) {
            setPostData(overridePostData);
        } else {
            getPostAgain(true);
        }
    }, [overridePostData, getPostAgain]);

    // fetch replies again
    useEffect(() => {
        if (viewing === "replies") {
            if (!overrideReplies) {
                getPostRepliesAgain(true);
            } else {
                setPostReplies(overrideReplies);
            }
        } else {
            setPostReplies([]);
        }
    }, [viewing, viewingDefault, overrideReplies, getPostRepliesAgain]);

    useEffect(() => {
        if (likePostResponse && likePostResponse.status < 400) {
            setPostData((prevPostData) => {
                if (prevPostData) {
                    return {
                        ...prevPostData,
                        likedByUser: !prevPostData.likedByUser,
                        likesCount: prevPostData.likedByUser
                            ? prevPostData.likesCount - 1
                            : prevPostData.likesCount + 1,
                    };
                }
                return prevPostData;
            });
        }
    }, [likePostResponse]);

    useEffect(() => {
        setWaiting(gettingPost);
    }, [gettingPost]);

    if (getPostResponse && getPostResponse.status === 401) window.location.assign("/");

    let sizes = {
        imageAndName: "l",
        contentFont: "1.1rem",
        contentLineHeight: "1.2rem",
        linksAndButtonsRegular: "1.1rem",
        linksAndButtonsStrong: "1.25rem",
        rowGap: "6px",
    };
    switch (size) {
        case "s":
            sizes.imageAndName = "s";
            sizes.contentFont = "1.0rem";
            sizes.contentLineHeight = "1.1rem";
            sizes.linksAndButtonsRegular = "1.0rem";
            sizes.linksAndButtonsStrong = "1.15rem";
            sizes.rowGap = "4px";
            break;
        default:
            sizes = { ...sizes };
            break;
    }

    const errorElement =
        errorMessage.length > 0 ? <p className={styles["error-message"]}>{errorMessage}</p> : null;

    return skeleton || postData ? (
        <>
            <div className={styles["container"]} style={{ gap: sizes.rowGap }}>
                {!removeLinkToReply && postData && postData.replyingTo ? (
                    <button
                        type="button"
                        className={styles["replying-to"]}
                        onClick={(e) => {
                            navigate(`/post/${postData.replyingTo}`);
                            e.currentTarget.blur();
                            e.preventDefault();
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.blur();
                        }}
                    >
                        <p className={`material-symbols-rounded ${styles["replying-to-arrow"]}`}>
                            arrow_back
                        </p>
                        <p className={styles["replying-to-text"]}>Replying To...</p>
                    </button>
                ) : null}
                <div className={styles["row-one"]}>
                    <User.ImageAndName
                        image={
                            postData && postData.author.preferences.profileImage
                                ? {
                                      src: postData.author.preferences.profileImage.url,
                                      alt: postData.author.preferences.profileImage.alt,
                                  }
                                : { src: "", alt: "" }
                        }
                        displayName={postData ? postData.author.preferences.displayName : " "}
                        accountTag={postData ? postData.author.accountTag : " "}
                        disableLinks={previewMode}
                        waiting={waiting}
                        size={sizes.imageAndName as "s" | "l"}
                    />
                </div>
                <div className={styles["row-two"]}>
                    <Accessibility.Skeleton waiting={waiting} style={{ width: "100%" }}>
                        <p
                            className={styles["text"]}
                            style={{
                                fontSize: sizes.contentFont,
                                lineHeight: sizes.contentLineHeight,
                            }}
                        >
                            {postData ? postData.text : "a"}
                        </p>
                    </Accessibility.Skeleton>
                    {postData && postData.images.length > 0 && (
                        <ul
                            className={styles["images"]}
                            data-image-quantity={`${Math.min(4, postData.images.length)}`}
                        >
                            {postData.images.map((image, i) => {
                                if (i >= 4) return null;
                                return (
                                    <li className={styles["image-container"]} key={`${image._id}`}>
                                        <Images.Basic
                                            src={image.url}
                                            alt={image.alt}
                                            style={{ width: "100%", height: "100%" }}
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
                <div className={styles["row-three"]}>
                    <div className={styles["row-three-left"]}>
                        <Accessibility.Skeleton waiting={waiting}>
                            <p className={styles["likes-count"]}>
                                <strong style={{ fontSize: sizes.linksAndButtonsStrong }}>
                                    {postData ? formatNumber(postData.likesCount, 1) : ""}
                                </strong>
                                <Buttons.Basic
                                    text={`Like${postData && postData.likesCount === 1 ? "" : "s"}`}
                                    label="view likes"
                                    palette="bare"
                                    onClickHandler={() => {
                                        if (!disableLikesLink) {
                                            navigate(
                                                `/post/${!getIdFromURLParam ? _id : postId}/likes`,
                                            );
                                        }
                                    }}
                                    otherStyles={{
                                        fontSize: sizes.linksAndButtonsRegular,
                                        fontWeight: "normal",
                                        padding: "0rem",
                                    }}
                                    disabled={previewMode || disableLikesLink || waiting}
                                />
                            </p>
                        </Accessibility.Skeleton>
                        <Accessibility.Skeleton waiting={waiting}>
                            <p className={styles["replies-count"]}>
                                <strong style={{ fontSize: sizes.linksAndButtonsStrong }}>
                                    {postData ? formatNumber(postData.repliesCount, 1) : " "}
                                </strong>
                                <Buttons.Basic
                                    text={`Repl${postData && postData.repliesCount === 1 ? "y" : "ies"}`}
                                    label="view replies"
                                    onClickHandler={() => {
                                        if (!disableRepliesLink) {
                                            if (canToggleReplies) {
                                                if (viewing === "replies") setViewing("");
                                                if (viewing !== "replies") setViewing("replies");
                                            } else {
                                                navigate(
                                                    `/post/${!getIdFromURLParam ? _id : postId}`,
                                                );
                                            }
                                        }
                                    }}
                                    palette="bare"
                                    otherStyles={{
                                        fontSize: sizes.linksAndButtonsRegular,
                                        fontWeight: "normal",
                                        padding: "0rem",
                                    }}
                                    disabled={previewMode || disableRepliesLink || waiting}
                                />
                            </p>
                        </Accessibility.Skeleton>
                    </div>
                    <div className={styles["row-three-buttons"]}>
                        <Accessibility.Skeleton
                            waiting={waiting}
                            style={{ borderRadius: "9999px" }}
                        >
                            <Buttons.Basic
                                text={postData && postData.likedByUser ? "" : "Like"}
                                symbol="star"
                                onClickHandler={() => {
                                    if (!overridePostData && postData !== null) likePostAgain(true);
                                }}
                                palette={postData && postData.likedByUser ? "gold" : "primary"}
                                otherStyles={{ fontSize: sizes.linksAndButtonsRegular }}
                                disabled={previewMode || waiting}
                            />
                        </Accessibility.Skeleton>
                        <Accessibility.Skeleton
                            waiting={waiting}
                            style={{ borderRadius: "9999px" }}
                        >
                            <Buttons.Basic
                                text="Reply"
                                symbol="reply"
                                onClickHandler={() => {
                                    if (!overridePostData && canReply) {
                                        PubSub.publish(
                                            "create-new-reply-button-click",
                                            !getIdFromURLParam ? _id : postId,
                                        );
                                    }
                                }}
                                otherStyles={{ fontSize: sizes.linksAndButtonsRegular }}
                                disabled={previewMode || waiting}
                            />
                        </Accessibility.Skeleton>
                        <Accessibility.Skeleton
                            waiting={waiting}
                            style={{ borderRadius: "9999px" }}
                        >
                            <Buttons.Basic
                                text="Share"
                                symbol="share"
                                otherStyles={{ fontSize: sizes.linksAndButtonsRegular }}
                                disabled={previewMode || waiting}
                            />
                        </Accessibility.Skeleton>
                    </div>
                </div>
            </div>
            {viewing === "replies" ? (
                <div className={styles["row-four"]}>
                    <ul className={styles["replies"]}>
                        {postReplies &&
                            postReplies.map((reply, i) => {
                                if (i >= maxRepliesToDisplay) return null;
                                return (
                                    <li className={styles["reply"]} key={reply.toString()}>
                                        <Posts.Post
                                            _id={reply}
                                            canReply
                                            removeLinkToReply
                                            size="s"
                                        />
                                    </li>
                                );
                            })}
                    </ul>
                    {!removeSeeMoreRepliesButton ? (
                        <div className={styles["see-more-replies-button-wrapper"]}>
                            <Buttons.Basic text="See More" otherStyles={{ fontSize: "1.1rem" }} />
                        </div>
                    ) : null}
                </div>
            ) : null}
        </>
    ) : (
        errorElement
    );
}

export default Post;
