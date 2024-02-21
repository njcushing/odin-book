import Images from "@/components/images";
import styles from "./index.module.css";

type RecentMessageTypes = {
    author?: string;
    text?: string;
};

type OptionTypes = {
    name?: string;
    participants?: string[];
    image?: Images.Types.Profile;
    recentMessage?: RecentMessageTypes;
};

function Option({ name = "", participants = [], image, recentMessage }: OptionTypes) {
    return (
        <div className={styles["container"]}>
            <div className={styles["profile-image-container"]}>
                <Images.Profile
                    src={image && image.src}
                    alt={image && image.alt}
                    status={image && image.status}
                    sizePx={64}
                />
            </div>
            <div className={styles["name-and-message-container"]}>
                {name && name.length > 0 ? (
                    <p className={`truncate-ellpisis ${styles["name"]}`} aria-label="chat name">
                        {name}
                    </p>
                ) : null}
                {recentMessage ? (
                    <p
                        className={`truncate-ellipsis ${styles["message"]}`}
                        aria-label="recent message"
                    >
                        {`${recentMessage.author}: ${recentMessage.text}`}
                    </p>
                ) : null}
            </div>
        </div>
    );
}

export default Option;
