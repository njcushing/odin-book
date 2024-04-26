import mongoose, { Schema, Document } from "mongoose";
import * as validateMessage from "@shared/validation/message";

export type TMessage = {
    author: mongoose.Types.ObjectId;
    text: string;
    images: mongoose.Types.ObjectId[];
    replyingTo?: mongoose.Types.ObjectId;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export interface IMessage extends TMessage, Document {}

const MessageSchema: Schema = new Schema(
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
                    type: Schema.Types.ObjectId,
                    ref: "Image",
                    trim: true,
                },
            ],
            validate: [
                {
                    validator: (value: Schema.Types.ObjectId[]) => value.length <= 4,
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

export default mongoose.model<IMessage>("Message", MessageSchema);
