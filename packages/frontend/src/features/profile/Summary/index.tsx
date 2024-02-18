import createMultilineTextTruncateStyles from "@/utils/createMultilineTextTruncateStyles";
import Images from "@/components/images";
import User from "@/components/user";
import styles from "./index.module.css";

type SummaryTypes = {
    type: "wide" | "thin";
};

function Summary({ type }: SummaryTypes) {
    if (type === "wide") {
        return (
            <div className={styles["container"]}>
                <div className={styles["row-one"]}>
                    <User.ImageAndName
                        image={{ src: new Uint8Array([]), alt: "" }}
                        displayName="John Smith"
                        accountTag="@JohnSmith84"
                        size="m"
                    />
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
                <Images.Profile src={new Uint8Array([])} sizePx={48} />
            </div>
        );
    }
}

export default Summary;
