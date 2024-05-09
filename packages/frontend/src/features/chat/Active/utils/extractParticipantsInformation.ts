import mongoose from "mongoose";

type Participants = {
    user: {
        _id: mongoose.Types.ObjectId;
        accountTag: string;
        preferences: {
            displayName: string;
        };
    };
    nickname: string;
    role: "admin" | "moderator" | "guest";
    muted: boolean;
}[];

export type ReturnTypes = {
    [key: string]: {
        userId: mongoose.Types.ObjectId;
        inChatName: string;
        role: "admin" | "moderator" | "guest";
        muted: boolean;
        status: "online" | "away" | "busy" | "offline" | null;
    };
};

const extractParticipantsInformation = (participants: Participants): ReturnTypes => {
    const info: ReturnTypes = {};
    participants.forEach((participant) => {
        const userId = `${participant.user._id}`;
        info[userId as keyof ReturnTypes] = {
            userId: participant.user._id,
            inChatName: (() => {
                if (participant.nickname.length > 0) {
                    return participant.nickname;
                }
                if (participant.user.preferences.displayName.length > 0) {
                    return participant.user.preferences.displayName;
                }
                return participant.user.accountTag;
            })(),
            role: participant.role,
            muted: participant.muted,
            status: null,
        };
    });
    return info;
};

export default extractParticipantsInformation;
