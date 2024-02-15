import { useState } from "react";
import ProfileImage from "@/components/ProfileImage";
import Posts from "..";
import createButton from "../utils/createButton";
import styles from "./index.module.css";

function Post() {
    const [viewing, setViewing]: [string, React.Dispatch<React.SetStateAction<string>>] =
        useState("");

    const posts = [null, null, null, null, null, null, null, null];

    return (
        <div className={styles["container"]}>
            <div className={styles["row-one"]}>
                <div className={styles["row-one-left"]}>
                    <ProfileImage src={new Uint8Array([])} sizePx={72} />
                </div>
                <div className={styles["row-one-right"]}>
                    <p className={`truncate-ellipsis ${styles["display-name"]}`}>John Smith</p>
                    <p className={`truncate-ellpisis ${styles["account-tag"]}`}>@JohnSmith84</p>
                </div>
            </div>
            <div className={styles["row-two"]}>
                <p className={styles["content"]}>
                    Sample Text Sample Text Sample Text Sample Text Sample Text Sample Text Sample
                    Text Sample Text Sample Text
                </p>
            </div>
            <div className={styles["row-three"]}>
                <p className={styles["likes-count"]}>
                    <strong>234</strong>
                    {createButton("Likes", "", styles, "view-likes-button", null)}
                </p>
                <p className={styles["replies-count"]}>
                    <strong>18</strong>
                    {createButton("Replies", "", styles, "view-replies-button", () => {
                        if (viewing === "replies") setViewing("");
                        if (viewing !== "replies") setViewing("replies");
                    })}
                </p>
                <div className={styles["row-three-buttons"]}>
                    {createButton("Reply", "reply", styles, "reply-button", null)}
                    {createButton("Share", "share", styles, "share-button", null)}
                </div>
            </div>
            {viewing === "replies" ? (
                <div className={styles["row-four"]}>
                    <ul className={styles["replies"]}>
                        {posts.map((post, i) => {
                            if (i >= 3) return null;
                            return <Posts.Reply key={i} />;
                        })}
                    </ul>
                    <div className={styles["see-more-replies-button-wrapper"]}>
                        {createButton("See More", "", styles, "see-more-replies-button", null)}
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default Post;
