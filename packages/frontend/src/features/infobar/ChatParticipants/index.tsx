import Images from "@/components/images";
import { ReturnTypes } from "@/features/chat/Active/utils/extractParticipantsInformation";
import styles from "./index.module.css";

export type TChatParticipants = {
    participants: ReturnTypes;
};

const roleHeirarchy = ["admin", "moderator", "guest"];

const organiseParticipants = (participants: ReturnTypes) => {
    const participantsArr = Object.values(participants);
    participantsArr.sort((a, b) => roleHeirarchy.indexOf(a.role) - roleHeirarchy.indexOf(b.role));
    return participantsArr;
};

function ChatParticipants({ participants }: TChatParticipants) {
    return (
        <div className={styles["container"]}>
            <h4 className={styles["title"]}>Participants</h4>
            <div className={styles["scrollable-wrapper"]}>
                <ul className={styles["participants"]}>
                    {organiseParticipants(participants).map((participant) => {
                        let role;
                        if (participant.role === "admin") role = "star";
                        if (participant.role === "moderator") role = "shield";

                        return (
                            <div
                                className={styles["participant-container"]}
                                key={`infobar-participant-${participant.userId}`}
                            >
                                {participant.profileImage ? (
                                    <Images.Profile
                                        src={participant.profileImage.url}
                                        alt={participant.profileImage.alt}
                                        sizePx={48}
                                    />
                                ) : (
                                    <Images.Profile sizePx={48} />
                                )}
                                <p className={styles["name"]}>{participant.inChatName}</p>
                                <ul className={styles["symbols"]}>
                                    {role ? (
                                        <p
                                            className={`material-symbols-rounded no-select ${styles["role"]}`}
                                            aria-label={participant.role}
                                        >
                                            {role}
                                        </p>
                                    ) : null}
                                </ul>
                            </div>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

export default ChatParticipants;
