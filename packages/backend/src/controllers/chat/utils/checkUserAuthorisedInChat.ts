import { TChatParticipants } from "@/models/chat";
import mongoose from "mongoose";

const roleHeirarchy = ["guest", "moderator", "admin"];

const checkUserAuthorisedInChat = (
    userId: mongoose.Types.ObjectId,
    chatParticipants: TChatParticipants,
    unauthIfMuted: boolean = false,
    requiredRole: "guest" | "moderator" | "admin" = "guest",
): [boolean, string] => {
    const userIdString = userId.toString();
    for (let i = 0; i < chatParticipants.length; i++) {
        const participant = chatParticipants[i];
        const participantUserIdString = participant.user._id.toString();
        if (participantUserIdString === userIdString) {
            if (unauthIfMuted && participant.muted) {
                return [false, "Specified user is muted in the specified chat."];
            }
            if (roleHeirarchy.indexOf(participant.role) < roleHeirarchy.indexOf(requiredRole)) {
                return [
                    false,
                    "Specified user does not have the required level of authorisation in the specified chat.",
                ];
            }
            return [true, "Specified user is authorised in the specified chat."];
        }
    }
    return [false, "Specified user is not a participant in the specified chat."];
};

export default checkUserAuthorisedInChat;
