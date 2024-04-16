import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Buttons from "@/components/buttons";
import User from "@/components/user";
import Inputs from "@/components/inputs";
import Images from "@/components/images";
import formatNumber from "@/utils/formatNumber";
import * as useAsync from "@/hooks/useAsync";
import mongoose from "mongoose";
import Posts from "..";
import getPost, { Params as GetPostParams, Response as GetPostResponse } from "./utils/getPost";
import likePost, { Params as LikePostParams } from "./utils/likePost";
import styles from "./index.module.css";

type PostTypes = {
    _id?: mongoose.Types.ObjectId;
    getIdFromURLParam?: boolean;
    overridePostData?: GetPostResponse;
    viewingDefault?: "" | "replies";
    canToggleReplies?: boolean;
    maxRepliesToDisplay?: number;
    overrideReplies?: mongoose.Types.ObjectId[];
    canReply?: boolean;
    replyingOpen?: boolean;
    removeSeeMoreRepliesButton?: boolean;
    removeLinkToReply?: boolean;
    disableRepliesLink?: boolean;
    disableLikesLink?: boolean;
    previewMode?: boolean;
    size?: "s" | "l";
};

function Post({
    _id,
    getIdFromURLParam = false,
    overridePostData,
    viewingDefault = "",
    canToggleReplies = false,
    maxRepliesToDisplay = 10,
    overrideReplies = [],
    canReply = false,
    replyingOpen = false,
    removeSeeMoreRepliesButton = false,
    removeLinkToReply = false,
    disableRepliesLink = false,
    disableLikesLink = false,
    previewMode = false,
    size = "l",
}: PostTypes) {
    const [postData, setPostData] = useState<GetPostResponse>(null);
    const [viewing, setViewing] = useState<"" | "replies">(!previewMode ? viewingDefault : "");
    const [replying, setReplying] = useState<boolean>(!previewMode ? replyingOpen : false);

    const { postId } = useParams();

    // get post api handling
    const [getPostResponse /* setGetPostParams */, , getPostAgain] = useAsync.GET<
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
        if (!overridePostData) {
            const newState = getPostResponse ? getPostResponse.data : null;
            setPostData(newState);
        }
    }, [overridePostData, getPostResponse]);

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
    }, [overridePostData, getPostAgain, likePostResponse]);

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

    let replies: mongoose.Types.ObjectId[] = [];
    if (overrideReplies.length > 0) {
        replies = overrideReplies;
    }

    const errorElement =
        errorMessage.length > 0 ? <p className={styles["error-message"]}>{errorMessage}</p> : null;

    return postData ? (
        <>
            <div className={styles["container"]} style={{ gap: sizes.rowGap }}>
                {!removeLinkToReply && postData.replyingTo ? (
                    <a className={styles["replying-to"]} href={`/post/${postData.replyingTo}`}>
                        <p className={`material-symbols-rounded ${styles["replying-to-arrow"]}`}>
                            arrow_back
                        </p>
                        <p className={styles["replying-to-text"]}>Replying To...</p>
                    </a>
                ) : null}
                <div className={styles["row-one"]}>
                    <User.ImageAndName
                        image={
                            postData.author.preferences.profileImage
                                ? {
                                      src: postData.author.preferences.profileImage.url,
                                      alt: postData.author.preferences.profileImage.alt,
                                  }
                                : { src: "", alt: "" }
                        }
                        displayName={postData.author.preferences.displayName}
                        accountTag={postData.author.accountTag}
                        disableLinks={previewMode}
                        size={sizes.imageAndName as "s" | "l"}
                    />
                </div>
                {(postData.text.length > 0 || postData.images.length > 0) && (
                    <div className={styles["row-two"]}>
                        {postData.text.length > 0 && (
                            <p
                                className={styles["text"]}
                                style={{
                                    fontSize: sizes.contentFont,
                                    lineHeight: sizes.contentLineHeight,
                                }}
                            >
                                {postData.text}
                            </p>
                        )}
                        {postData.images.length > 0 && (
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
                )}
                <div className={styles["row-three"]}>
                    <div className={styles["row-three-left"]}>
                        <p className={styles["likes-count"]}>
                            <strong style={{ fontSize: sizes.linksAndButtonsStrong }}>
                                {formatNumber(postData.likesCount, 1)}
                            </strong>
                            <Buttons.Basic
                                text={`Like${postData.likesCount === 1 ? "" : "s"}`}
                                label="view likes"
                                palette="bare"
                                onClickHandler={() => {
                                    if (!disableLikesLink) {
                                        window.location.href = `/post/${!getIdFromURLParam ? _id : postId}/likes`;
                                    }
                                }}
                                otherStyles={{
                                    fontSize: sizes.linksAndButtonsRegular,
                                    fontWeight: "normal",
                                    padding: "0rem",
                                }}
                                disabled={previewMode || disableLikesLink}
                            />
                        </p>
                        <p className={styles["replies-count"]}>
                            <strong style={{ fontSize: sizes.linksAndButtonsStrong }}>
                                {formatNumber(postData.repliesCount, 1)}
                            </strong>
                            <Buttons.Basic
                                text={`Repl${postData.repliesCount === 1 ? "y" : "ies"}`}
                                label="view replies"
                                onClickHandler={() => {
                                    if (!disableRepliesLink) {
                                        if (canToggleReplies) {
                                            if (viewing === "replies") setViewing("");
                                            if (viewing !== "replies") setViewing("replies");
                                        } else {
                                            window.location.href = `/post/${!getIdFromURLParam ? _id : postId}`;
                                        }
                                    }
                                }}
                                palette="bare"
                                otherStyles={{
                                    fontSize: sizes.linksAndButtonsRegular,
                                    fontWeight: "normal",
                                    padding: "0rem",
                                }}
                                disabled={previewMode || disableRepliesLink}
                            />
                        </p>
                    </div>
                    <div className={styles["row-three-buttons"]}>
                        <Buttons.Basic
                            text={postData.likedByUser ? "" : "Like"}
                            symbol="star"
                            onClickHandler={() => {
                                if (!overridePostData && postData !== null) likePostAgain(true);
                            }}
                            palette={postData.likedByUser ? "gold" : "primary"}
                            otherStyles={{ fontSize: sizes.linksAndButtonsRegular }}
                            disabled={previewMode}
                        />
                        <Buttons.Basic
                            text="Reply"
                            symbol="reply"
                            onClickHandler={() => {
                                if (canReply) setReplying(!replying);
                            }}
                            otherStyles={{ fontSize: sizes.linksAndButtonsRegular }}
                            disabled={previewMode}
                        />
                        <Buttons.Basic
                            text="Share"
                            symbol="share"
                            otherStyles={{ fontSize: sizes.linksAndButtonsRegular }}
                            disabled={previewMode}
                        />
                    </div>
                </div>
                {replying ? (
                    <div className={styles["row-four"]}>
                        <Inputs.Message
                            textFieldId="reply-text"
                            textFieldName="replyText"
                            placeholder="Type your reply..."
                            imageFieldId="reply-images"
                            imageFieldName="replyImages"
                        />
                    </div>
                ) : null}
            </div>
            {viewing === "replies" ? (
                <div className={styles["row-five"]}>
                    <ul className={styles["replies"]}>
                        {replies.map((reply, i) => {
                            if (i >= maxRepliesToDisplay) return null;
                            return (
                                <li className={styles["reply"]} key={reply.toString()}>
                                    <Posts.Post _id={reply} size="s" />
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
