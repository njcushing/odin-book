import mongoose, { Schema, Document } from "mongoose";
import * as validateChat from "@shared/validation/chat";

export type TChatParticipants = {
    user: mongoose.Types.ObjectId;
    nickname?: string;
    role?: "admin" | "moderator" | "guest";
    muted?: boolean;
}[];

export type TChat = {
    type: "individual" | "group";
    participants: TChatParticipants;
    name?: string;
    image?: {
        type?: string;
    };
    messages?: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
};

export interface IChat extends TChat, Document {}

const ChatSchema: Schema = new Schema(
    {
        type: {
            type: String,
            enum: ["individual", "group"],
            require: true,
        },
        participants: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                    require: true,
                },
                nickname: { type: String, default: "" },
                role: {
                    type: String,
                    enum: ["admin", "moderator", "guest"],
                    default: "guest",
                },
                muted: { type: Boolean, default: false },
            },
        ],
        name: {
            type: String,
            trim: true,
            validate: {
                validator(value: string) {
                    return validateChat.name(value, "back").status;
                },
                message: (props: { value: string }) =>
                    validateChat.name(props.value, "back").message,
            },
            default: "",
        },
        image: {
            type: {
                type: Schema.Types.ObjectId,
                ref: "Image",
            },
        },
        messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    },
    {
        getters: true,
        timestamps: true,
    },
);

ChatSchema.set("toObject", { virtuals: true });
ChatSchema.set("toJSON", { virtuals: true });

export default mongoose.model<IChat>("Chat", ChatSchema);
