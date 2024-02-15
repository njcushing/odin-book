import createMultilineTextTruncateStyles from "@/utils/createMultilineTextTruncateStyles";
import ProfileImage from "@/components/ProfileImage";
import styles from "./index.module.css";

type SummaryTypes = {
    type: "wide" | "thin";
};

function Summary({ type }: SummaryTypes) {
    if (type === "wide") {
        return (
            <div className={styles["container"]}>
                <div className={styles["row-one"]}>
                    <div className={styles["row-one-left"]}>
                        <ProfileImage src={new Uint8Array([])} sizePx={64} />
                    </div>
                    <div className={styles["row-one-right"]}>
                        <p className={`truncate-ellipsis ${styles["display-name"]}`}>John Smith</p>
                        <p className={`truncate-ellpisis ${styles["account-tag"]}`}>@JohnSmith84</p>
                    </div>
                </div>
                <div className={styles["row-two"]}>
                    <p
                        className={styles["bio"]}
                        style={{ ...createMultilineTextTruncateStyles(4) }}
                    >
                        Sample Text Sample Text Sample Text Sample Text Sample Text Sample Text
                        Sample Text Sample Text Sample Text
                    </p>
                </div>
                <div className={styles["row-three"]}>
                    <p className={styles["following-count"]}>
                        <strong>300</strong> Following
                    </p>
                    <p className={styles["followers-count"]}>
                        <strong>192</strong> Followers
                    </p>
                    <p className={styles["likes-count"]}>
                        <strong>3892</strong> Likes
                    </p>
                </div>
                <div className={styles["row-four"]}>
                    <p className={styles["account-creation-date"]}>Joined February 2024</p>
                </div>
            </div>
        );
    }

    if (type === "thin") {
        return (
            <div className={styles["container"]}>
                <ProfileImage src={new Uint8Array([])} sizePx={48} />
            </div>
        );
    }
}

export default Summary;
