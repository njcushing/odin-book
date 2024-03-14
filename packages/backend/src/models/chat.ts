import mongoose from "mongoose";
import * as validateChat from "@shared/validation/chat";

const { Schema } = mongoose;

const ChatSchema = new Schema(
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
                message: (props) => validateChat.name(props.value, "back").message,
            },
            default: "",
        },
        image: {
            type: {
                type: String,
                trim: true,
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

export default mongoose.model("Chat", ChatSchema);
