import mongoose from "mongoose";

import { Response } from "@/features/chat/utils/getChatOverview";

export type ReturnTypes = {
    [key: string]: {
        userId: mongoose.Types.ObjectId;
        inChatName: string;
        profileImage: {
            _id: mongoose.Types.ObjectId;
            url: string;
            alt: string;
        } | null;
        role: "admin" | "moderator" | "guest";
        creator: boolean;
        muted: boolean;
        status: "online" | "away" | "busy" | "offline" | null;
    };
};

const extractParticipantsInformation = (chatData: Response): ReturnTypes => {
    if (!chatData) return {};
    const { createdBy, participants } = chatData;
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
            profileImage: participant.user.preferences.profileImage,
            role: participant.role,
            creator: createdBy === participant.user._id,
            muted: participant.muted,
            status: null,
        };
    });
    return info;
};

export default extractParticipantsInformation;
