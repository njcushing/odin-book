import { Response } from "@/features/chat/utils/getChatOverview";
import combineParticipantNames from "@/features/chat/utils/combineParticipantNames";

const determineChatName = (chatData: Response): string => {
    let chatName = "Chat";
    if (chatData) {
        if (chatData.name.length > 0) {
            chatName = chatData.name;
        } else if (chatData.participants && chatData.participants.length > 0) {
            const extractedParticipantNames = chatData.participants.map((participant) => {
                if (participant.nickname.length > 0) {
                    return participant.nickname;
                }
                if (participant.user.preferences.displayName.length > 0) {
                    return participant.user.preferences.displayName;
                }
                return participant.user.accountTag;
            });
            chatName = combineParticipantNames(extractedParticipantNames as unknown as string[], 3);
        }
    }
    return chatName;
};

export default determineChatName;
