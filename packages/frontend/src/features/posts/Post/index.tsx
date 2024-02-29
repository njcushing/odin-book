import { useState, useEffect } from "react";
import Buttons from "@/components/buttons";
import User from "@/components/user";
import Inputs from "@/components/inputs";
import Images from "@/components/images";
import * as modelTypes from "@/utils/modelTypes";
import * as extendedTypes from "@/utils/extendedTypes";
import * as mockData from "@/mockData";
import { v4 as uuidv4 } from "uuid";
import formatNumber from "@/utils/formatNumber";
import Posts from "..";
import styles from "./index.module.css";

type PostTypes = {
    _id?: extendedTypes.MongoDBObjectId;
    overridePostData?: modelTypes.Post;
    viewingDefault?: "" | "replies";
    canToggleReplies?: boolean;
    maxRepliesToDisplay?: number;
    overrideReplies?: extendedTypes.MongoDBObjectId[];
    canReply?: boolean;
    replyingOpen?: boolean;
    size?: "s" | "l";
};

function Post({
    _id,
    overridePostData,
    viewingDefault = "",
    canToggleReplies = false,
    maxRepliesToDisplay = 10,
    overrideReplies = [],
    canReply = false,
    replyingOpen = false,
    size = "l",
}: PostTypes) {
    const [postData, setPostData] = useState<modelTypes.Post | null>(null);
    const [liked, setLiked] = useState<boolean>(false);
    const [viewing, setViewing] = useState<"" | "replies">(viewingDefault);
    const [replying, setReplying] = useState<boolean>(replyingOpen);

    useEffect(() => {
        (async () => {
            if (overridePostData) {
                setPostData(overridePostData);
            } else {
                // fetch post data
                let data = null;
                if (_id) data = mockData.getPost(_id);
                setPostData(data);
            }
        })();
    }, [_id, overridePostData]);

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

    let replies: extendedTypes.MongoDBObjectId[] = [];
    if (overrideReplies.length > 0) {
        replies = overrideReplies;
    }

    return postData ? (
        <>
            <div className={styles["container"]} style={{ gap: sizes.rowGap }}>
                <div className={styles["row-one"]}>
                    <User.ImageAndName
                        image={{
                            src: postData.author.preferences.profileImage.src,
                            alt: postData.author.preferences.profileImage.alt,
                        }}
                        displayName={postData.author.preferences.displayName}
                        accountTag={postData.author.accountTag}
                        size={sizes.imageAndName as "s" | "l"}
                    />
                </div>
                <div className={styles["row-two"]}>
                    <p
                        className={styles["text"]}
                        style={{
                            fontSize: sizes.contentFont,
                            lineHeight: sizes.contentLineHeight,
                        }}
                    >
                        {postData.content.text}
                    </p>
                    {postData.content.images.length > 0 && (
                        <ul
                            className={styles["images"]}
                            data-image-quantity={`${Math.min(4, postData.content.images.length)}`}
                        >
                            {postData.content.images.map((image, i) => {
                                if (i >= 4) return null;
                                return (
                                    <li className={styles["image-container"]} key={uuidv4()}>
                                        <Images.Basic
                                            src={image.src}
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
                    <p className={styles["likes-count"]}>
                        <strong style={{ fontSize: sizes.linksAndButtonsStrong }}>
                            {formatNumber(postData.likesQuantity, 1)}
                        </strong>
                        <Buttons.Basic
                            text="Likes"
                            label="view likes"
                            palette="bare"
                            otherStyles={{
                                fontSize: sizes.linksAndButtonsRegular,
                                fontWeight: "normal",
                                padding: "0rem",
                            }}
                        />
                    </p>
                    <p className={styles["replies-count"]}>
                        <strong style={{ fontSize: sizes.linksAndButtonsStrong }}>
                            {formatNumber(postData.repliesQuantity, 1)}
                        </strong>
                        <Buttons.Basic
                            text="Replies"
                            label="view replies"
                            onClickHandler={() => {
                                if (canToggleReplies) {
                                    if (viewing === "replies") setViewing("");
                                    if (viewing !== "replies") setViewing("replies");
                                } else {
                                    // repliesClickHandler
                                }
                            }}
                            palette="bare"
                            otherStyles={{
                                fontSize: sizes.linksAndButtonsRegular,
                                fontWeight: "normal",
                                padding: "0rem",
                            }}
                        />
                    </p>
                    <div className={styles["row-three-buttons"]}>
                        <Buttons.Basic
                            text={liked ? "" : "Like"}
                            symbol="star"
                            palette={liked ? "gold" : "primary"}
                            otherStyles={{ fontSize: sizes.linksAndButtonsRegular }}
                        />
                        <Buttons.Basic
                            text="Reply"
                            symbol="reply"
                            onClickHandler={() => {
                                if (canReply) setReplying(!replying);
                            }}
                            otherStyles={{ fontSize: sizes.linksAndButtonsRegular }}
                        />
                        <Buttons.Basic
                            text="Share"
                            symbol="share"
                            otherStyles={{ fontSize: sizes.linksAndButtonsRegular }}
                        />
                    </div>
                </div>
                {replying ? (
                    <div className={styles["row-four"]}>
                        <Inputs.Message placeholder="Type your reply..." />
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
                    <div className={styles["see-more-replies-button-wrapper"]}>
                        <Buttons.Basic text="See More" otherStyles={{ fontSize: "1.1rem" }} />
                    </div>
                </div>
            ) : null}
        </>
    ) : null;
}

export default Post;
