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
import formatPostDate from "./utils/formatPostDate";
import getPost, { Params as GetPostParams, Response as GetPostResponse } from "./utils/getPost";
import likePost, { Params as LikePostParams } from "./utils/likePost";
import styles from "./index.module.css";

type PostTypes = {
    _id?: mongoose.Types.ObjectId;
    getIdFromURLParam?: boolean;
    overridePostData?: GetPostResponse;
    canReply?: boolean;
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
    canReply = false,
    removeLinkToReply = false,
    disableRepliesLink = false,
    disableLikesLink = false,
    previewMode = false,
    skeleton = true,
    size = "l",
}: PostTypes) {
    const { postId } = useParams();

    const navigate = useNavigate();

    const [initialWaiting, setInitialWaiting] = useState(!overridePostData);
    const [, /* waiting */ setWaiting] = useState(!overridePostData);

    const [postData, setPostData] = useState<GetPostResponse>(null);

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

    // like post api handling
    const [likePostResponse /* setLikePostParams */, , likePostAgain, likingPost] = useAsync.PUT<
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

    // fetch post again
    useEffect(() => {
        if (overridePostData) {
            setPostData(overridePostData);
        } else {
            getPostAgain(true);
        }
    }, [overridePostData, getPostAgain]);

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
        if (!gettingPost) setInitialWaiting(gettingPost);
        setWaiting(gettingPost || likingPost);
    }, [gettingPost, likingPost]);

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

    const errorMessageElement =
        errorMessage.length > 0 ? <p className={styles["error-message"]}>{errorMessage}</p> : null;

    let currentDateText = "";
    if (postData) {
        currentDateText = formatPostDate(postData.createdAt);
    } else if (initialWaiting) {
        const currentDate = new Date();
        currentDate.toISOString();
        currentDateText = formatPostDate(`${currentDate}`);
    }

    return (
        <div className={styles["wrapper"]}>
            {errorMessageElement}
            {skeleton || postData ? (
                <div className={styles["container"]} style={{ gap: sizes.rowGap }}>
                    <div className={styles["row-one"]}>
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
                                <p
                                    className={`material-symbols-rounded ${styles["replying-to-arrow"]}`}
                                >
                                    arrow_back
                                </p>
                                <p className={styles["replying-to-text"]}>Replying To...</p>
                            </button>
                        ) : (
                            <div></div>
                        )}
                        <Accessibility.Skeleton waiting={initialWaiting}>
                            <p className={styles["date-and-time"]}>{currentDateText}</p>
                        </Accessibility.Skeleton>
                    </div>
                    <div className={styles["row-two"]}>
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
                            waiting={initialWaiting}
                            size={sizes.imageAndName as "s" | "l"}
                        />
                    </div>
                    <div className={styles["row-three"]}>
                        <Accessibility.Skeleton waiting={initialWaiting} style={{ width: "100%" }}>
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
                                        <li
                                            className={styles["image-container"]}
                                            key={`${image._id}`}
                                        >
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
                    <div className={styles["row-four"]}>
                        <div className={styles["row-four-left"]}>
                            <Accessibility.Skeleton waiting={initialWaiting}>
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
                                        disabled={previewMode || disableLikesLink || initialWaiting}
                                    />
                                </p>
                            </Accessibility.Skeleton>
                            <Accessibility.Skeleton waiting={initialWaiting}>
                                <p className={styles["replies-count"]}>
                                    <strong style={{ fontSize: sizes.linksAndButtonsStrong }}>
                                        {postData ? formatNumber(postData.repliesCount, 1) : " "}
                                    </strong>
                                    <Buttons.Basic
                                        text={`Repl${postData && postData.repliesCount === 1 ? "y" : "ies"}`}
                                        label="view replies"
                                        onClickHandler={() => {
                                            if (!disableRepliesLink) {
                                                navigate(
                                                    `/post/${!getIdFromURLParam ? _id : postId}`,
                                                );
                                            }
                                        }}
                                        palette="bare"
                                        otherStyles={{
                                            fontSize: sizes.linksAndButtonsRegular,
                                            fontWeight: "normal",
                                            padding: "0rem",
                                        }}
                                        disabled={
                                            previewMode || disableRepliesLink || initialWaiting
                                        }
                                    />
                                </p>
                            </Accessibility.Skeleton>
                        </div>
                        <div className={styles["row-four-buttons"]}>
                            <Accessibility.Skeleton
                                waiting={initialWaiting}
                                style={{ borderRadius: "9999px" }}
                            >
                                <Buttons.Basic
                                    text={postData && postData.likedByUser ? "" : "Like"}
                                    symbol="star"
                                    onClickHandler={() => {
                                        if (!overridePostData && postData !== null)
                                            likePostAgain(true);
                                    }}
                                    palette={postData && postData.likedByUser ? "gold" : "primary"}
                                    otherStyles={{ fontSize: sizes.linksAndButtonsRegular }}
                                    disabled={previewMode || likingPost}
                                />
                            </Accessibility.Skeleton>
                            <Accessibility.Skeleton
                                waiting={initialWaiting}
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
                                    disabled={previewMode || initialWaiting}
                                />
                            </Accessibility.Skeleton>
                            <Accessibility.Skeleton
                                waiting={initialWaiting}
                                style={{ borderRadius: "9999px" }}
                            >
                                <Buttons.Basic
                                    text="Share"
                                    symbol="share"
                                    otherStyles={{ fontSize: sizes.linksAndButtonsRegular }}
                                    disabled={previewMode || initialWaiting}
                                />
                            </Accessibility.Skeleton>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default Post;
