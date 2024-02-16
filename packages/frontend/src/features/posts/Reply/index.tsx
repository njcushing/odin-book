import ProfileImage from "@/components/images/ProfileImage";
import createMultilineTextTruncateStyles from "@/utils/createMultilineTextTruncateStyles";
import Buttons from "@/components/buttons";
import User from "@/components/user";
import createButton from "../utils/createButton";
import styles from "./index.module.css";

function Reply() {
    return (
        <div className={styles["container"]}>
            <div className={styles["row-one"]}>
                <User.ImageAndName
                    image={{ src: new Uint8Array([]), alt: "" }}
                    displayName="John Smith"
                    accountTag="@JohnSmith84"
                    size="s"
                />
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
                    <Buttons.Basic text="Reply" symbol="reply" />
                    <Buttons.Basic text="Share" symbol="share" />
                </div>
            </div>
        </div>
    );
}

export default Reply;
