import mongoose from "mongoose";
import * as validateMessage from "@shared/validation/message";

const { Schema } = mongoose;

const MessageSchema = new Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            trim: true,
            validate: {
                validator(value: string) {
                    return validateMessage.text(value, "back").status;
                },
                message: (props: { value: string }) =>
                    validateMessage.text(props.value, "back").message,
            },
        },
        images: {
            type: [
                {
                    type: String,
                    trim: true,
                },
            ],
            validate: [
                {
                    validator: (value: string) => value.length <= 4,
                    message: "A message cannot contain more than 4 images",
                },
            ],
        },
        replyingTo: { type: Schema.Types.ObjectId, ref: "Message" },
        deleted: { type: Boolean, default: false },
    },
    {
        getters: true,
        timestamps: true,
    },
);

MessageSchema.set("toObject", { virtuals: true });
MessageSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Message", MessageSchema);
