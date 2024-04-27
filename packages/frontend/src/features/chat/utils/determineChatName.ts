import { Response } from "@/features/chat/utils/getChatOverview";
import combineParticipantNames from "@/features/chat/utils/combineParticipantNames";
import mongoose from "mongoose";

type Params = {
    chatData: Response;
    numberToCombine?: number;
    ignoreActiveUser?: boolean;
    activeUserId?: mongoose.Types.ObjectId;
};

const determineChatName = (params: Params): string => {
    const { chatData, numberToCombine = 3, ignoreActiveUser = true, activeUserId } = params;

    let chatName = "Chat";
    if (chatData) {
        if (chatData.name.length > 0) {
            chatName = chatData.name;
        } else if (chatData.participants && chatData.participants.length > 0) {
            const namesToCombine: string[] = [];
            let i = 0;
            while (namesToCombine.length < numberToCombine && i < chatData.participants.length) {
                const participant = chatData.participants[i];
                if (!ignoreActiveUser || participant.user._id !== activeUserId) {
                    if (participant.nickname.length > 0) {
                        namesToCombine.push(participant.nickname);
                    } else if (participant.user.preferences.displayName.length > 0) {
                        namesToCombine.push(participant.user.preferences.displayName);
                    } else {
                        namesToCombine.push(participant.user.accountTag);
                    }
                }
                i += 1;
            }
            chatName = combineParticipantNames(
                namesToCombine,
                Math.min(namesToCombine.length, numberToCombine),
            );
        }
    }
    return chatName;
};

export default determineChatName;
