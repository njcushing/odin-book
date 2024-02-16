import { useState } from "react";
import Buttons from "@/components/buttons";
import User from "@/components/user";
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
                <User.ImageAndName
                    image={{ src: new Uint8Array([]), alt: "" }}
                    displayName="John Smith"
                    accountTag="@JohnSmith84"
                    size="l"
                />
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
                    <Buttons.Basic
                        text="Reply"
                        symbol="reply"
                        otherStyles={{ fontSize: "1.1rem" }}
                    />
                    <Buttons.Basic
                        text="Share"
                        symbol="share"
                        otherStyles={{ fontSize: "1.1rem" }}
                    />
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
                        <Buttons.Basic text="See More" otherStyles={{ fontSize: "1.1rem" }} />
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default Post;
