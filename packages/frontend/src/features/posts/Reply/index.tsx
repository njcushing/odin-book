import ProfileImage from "@/components/ProfileImage";
import createMultilineTextTruncateStyles from "@/utils/createMultilineTextTruncateStyles";
import createButton from "../utils/createButton";
import styles from "./index.module.css";

function Reply() {
    return (
        <div className={styles["container"]}>
            <div className={styles["row-one"]}>
                <div className={styles["row-one-left"]}>
                    <ProfileImage src={new Uint8Array([])} sizePx={48} />
                </div>
                <div className={styles["row-one-right"]}>
                    <p className={`truncate-ellipsis ${styles["display-name"]}`}>John Smith</p>
                    <p className={`truncate-ellpisis ${styles["account-tag"]}`}>@JohnSmith84</p>
                </div>
            </div>
            <div className={styles["row-two"]}>
                <p
                    className={styles["content"]}
                    style={{ ...createMultilineTextTruncateStyles(4) }}
                >
                    Sample Text Sample Text Sample Text Sample Text Sample Text Sample Text Sample
                    Text Sample Text Sample Text Sample Text Sample Text Sample Text Sample Text
                    Sample Text Sample Text Sample
                </p>
            </div>
            <div className={styles["row-three"]}>
                <p className={styles["likes-count"]}>
                    <strong>234</strong>
                    {createButton("Likes", "", styles, "view-likes-button", null)}
                </p>
                <p className={styles["replies-count"]}>
                    <strong>18</strong>
                    {createButton("Replies", "", styles, "view-replies-button", null)}
                </p>
                <div className={styles["row-three-buttons"]}>
                    {createButton("Reply", "reply", styles, "reply-button", null)}
                    {createButton("Share", "share", styles, "share-button", null)}
                </div>
            </div>
        </div>
    );
}

export default Reply;
