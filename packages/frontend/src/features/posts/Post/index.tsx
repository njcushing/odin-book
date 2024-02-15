import { useState } from "react";
import ProfileImage from "@/components/ProfileImage";
import styles from "./index.module.css";

function Post() {
    const [viewing, setViewing]: [string, React.Dispatch<React.SetStateAction<string>>] =
        useState("");

    const createButton = (
        text: string,
        symbol: string,
        className: string,
        onClickHandler: ((event?: React.MouseEvent<HTMLButtonElement>) => void) | null,
    ) => {
        return (
            <button
                type="button"
                className={styles[className]}
                onClick={(e) => {
                    if (onClickHandler) onClickHandler(e);
                    e.currentTarget.blur();
                    e.preventDefault();
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.blur();
                }}
            >
                {symbol && symbol.length > 0 && (
                    <p className={`material-symbols-rounded ${styles["button-symbol"]}`}>
                        {symbol}
                    </p>
                )}
                {text}
            </button>
        );
    };

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
                    {createButton("Likes", "", "view-likes-button", () => {
                        if (viewing === "likes") setViewing("");
                        if (viewing !== "likes") setViewing("likes");
                    })}
                </p>
                <p className={styles["replies-count"]}>
                    <strong>18</strong>
                    {createButton("Replies", "", "view-replies-button", () => {
                        if (viewing === "replies") setViewing("");
                        if (viewing !== "replies") setViewing("replies");
                    })}
                </p>
                <div className={styles["row-three-buttons"]}>
                    {createButton("Reply", "reply", "reply-button", null)}
                    {createButton("Share", "share", "share-button", null)}
                </div>
            </div>
            {viewing === "likes" ? (
                <div className={styles["row-four"]}>
                    <li className={styles["likes"]}></li>
                </div>
            ) : null}
            {viewing === "replies" ? (
                <div className={styles["row-four"]}>
                    <li className={styles["replies"]}></li>
                </div>
            ) : null}
        </div>
    );
}

export default Post;
