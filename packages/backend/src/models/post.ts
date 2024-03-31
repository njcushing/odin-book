import mongoose, { Schema, Document } from "mongoose";
import * as validatePost from "@shared/validation/post";

export type TPost = {
    author: mongoose.Types.ObjectId;
    text?: string;
    images?: string[];
    replyingTo?: mongoose.Types.ObjectId;
    likes?: mongoose.Types.ObjectId[];
    replies?: mongoose.Types.ObjectId[];
    deleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};

export interface IPost extends TPost, Document {}

const PostSchema: Schema = new Schema(
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
                    return validatePost.text(value, "back").status;
                },
                message: (props: { value: string }) =>
                    validatePost.text(props.value, "back").message,
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
                    message: "A post cannot contain more than 4 images",
                },
            ],
        },
        replyingTo: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            default: null,
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        replies: [
            {
                type: Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
        deleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        getters: true,
        timestamps: true,
    },
);

PostSchema.set("toObject", { virtuals: true });
PostSchema.set("toJSON", { virtuals: true });

export default mongoose.model<IPost>("Post", PostSchema);
