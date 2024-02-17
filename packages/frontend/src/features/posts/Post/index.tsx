import { useState } from "react";
import Buttons from "@/components/buttons";
import User from "@/components/user";
import Inputs from "@/components/inputs";
import Posts from "..";
import styles from "./index.module.css";

type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

type PostTypes = {
    type: "post" | "reply";
    viewingDefault?: "" | "replies";
    replyingOpen?: boolean;
};

function Post({ type = "post", viewingDefault = "", replyingOpen = false }: PostTypes) {
    const [viewing, setViewing]: ["" | "replies", Setter<"" | "replies">] =
        useState(viewingDefault);
    const [replying, setReplying]: [boolean, Setter<boolean>] = useState(replyingOpen);

    const posts = [null, null, null, null, null, null, null, null];

    let sizes = {
        imageAndName: "l",
        contentFont: "1.1rem",
        contentLineHeight: "1.2rem",
        linksAndButtonsRegular: "1.1rem",
        linksAndButtonsStrong: "1.25rem",
        rowGap: "6px",
    };
    switch (type) {
        case "reply":
            sizes.imageAndName = "s";
            sizes.contentFont = "1.0rem";
            sizes.contentLineHeight = "1.1rem";
            sizes.linksAndButtonsRegular = "1.0rem";
            sizes.linksAndButtonsStrong = "1.15rem";
            sizes.rowGap = "4px";
            break;
        case "post":
        default:
            sizes = { ...sizes };
            break;
    }

    return (
        <div
            className={styles["container"]}
            data-is-reply={type === "reply"}
            style={{
                gap: sizes.rowGap,
            }}
        >
            <div className={styles["row-one"]}>
                <User.ImageAndName
                    image={{ src: new Uint8Array([]), alt: "" }}
                    displayName="John Smith"
                    accountTag="@JohnSmith84"
                    size={sizes.imageAndName}
                />
            </div>
            <div className={styles["row-two"]}>
                <p
                    className={styles["content"]}
                    style={{
                        fontSize: sizes.contentFont,
                        lineHeight: sizes.contentLineHeight,
                    }}
                >
                    Sample Text Sample Text Sample Text Sample Text Sample Text Sample Text Sample
                    Text Sample Text Sample Text
                </p>
            </div>
            <div className={styles["row-three"]}>
                <p className={styles["likes-count"]}>
                    <strong style={{ fontSize: sizes.linksAndButtonsStrong }}>234</strong>
                    <button
                        type="button"
                        className={styles["view-likes-button"]}
                        aria-label="view-likes"
                        onClick={(e) => {
                            e.currentTarget.blur();
                            e.preventDefault();
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.blur();
                        }}
                        style={{
                            fontSize: sizes.linksAndButtonsRegular,
                        }}
                    >
                        Likes
                    </button>
                </p>
                <p className={styles["replies-count"]}>
                    <strong style={{ fontSize: sizes.linksAndButtonsStrong }}>18</strong>
                    <button
                        type="button"
                        className={styles["view-replies-button"]}
                        aria-label="view-replies"
                        onClick={(e) => {
                            if (type === "post") {
                                if (viewing === "replies") setViewing("");
                                if (viewing !== "replies") setViewing("replies");
                            }
                            if (type === "reply") {
                                // redirect user to reply
                            }
                            e.currentTarget.blur();
                            e.preventDefault();
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.blur();
                        }}
                        style={{
                            fontSize: sizes.linksAndButtonsRegular,
                        }}
                    >
                        Replies
                    </button>
                </p>
                <div className={styles["row-three-buttons"]}>
                    <Buttons.Basic
                        text="Reply"
                        symbol="reply"
                        onClickHandler={() => setReplying(!replying)}
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
            {viewing === "replies" ? (
                <div className={styles["row-five"]}>
                    <ul className={styles["replies"]}>
                        {posts.map((post, i) => {
                            if (i >= 3) return null;
                            return <Posts.Post type="reply" key={i} />;
                        })}
                    </ul>
                    <div className={styles["see-more-replies-button-wrapper"]}>
                        <Buttons.Basic text="See More" otherStyles={{ fontSize: "1.1rem" }} />
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default Post;
