import Images from "@/components/images";
import { ProfileTypes } from "@/components/images/components/Profile";
import Buttons from "@/components/buttons";
import combineParticipantNames from "../utils/combineParticipantNames";
import styles from "./index.module.css";

type RecentMessageTypes = {
    author?: string;
    text?: string;
};

type OptionTypes = {
    name?: string;
    participants?: string[];
    image?: ProfileTypes;
    recentMessage?: RecentMessageTypes;
    onDeleteClickHandler?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | null;
};

function Option({
    name = "",
    participants = [],
    image,
    recentMessage,
    onDeleteClickHandler = null,
}: OptionTypes) {
    let chatName = "Chat";
    if (name && name.length > 0) {
        chatName = name;
    } else if (participants && participants.length > 0) {
        chatName = combineParticipantNames(participants, 3);
    }

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
                <p className={`truncate-ellipsis ${styles["name"]}`} aria-label="chat name">
                    {chatName}
                </p>
                {recentMessage ? (
                    <p
                        className={`truncate-ellipsis ${styles["message"]}`}
                        aria-label="recent message"
                    >
                        {`${recentMessage.author}: ${recentMessage.text}`}
                    </p>
                ) : null}
            </div>
            <Buttons.Basic
                text=""
                symbol="delete"
                onClickHandler={(e) => {
                    if (onDeleteClickHandler) onDeleteClickHandler(e);
                }}
                palette="red"
                otherStyles={{
                    fontSize: "0.9rem",
                    padding: "0.5rem",
                }}
            />
        </div>
    );
}

export default Option;
