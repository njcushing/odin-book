import mongoose from "mongoose";
import * as validatePost from "@shared/validation/post";

const { Schema } = mongoose;

const PostSchema = new Schema(
    {
        text: {
            type: String,
            trim: true,
            validate: {
                validator(value: string) {
                    return validatePost.text(value, "back").status;
                },
                message: (props) => validatePost.text(props.value, "back").message,
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
    },
    {
        getters: true,
        timestamps: true,
    },
);

PostSchema.set("toObject", { virtuals: true });
PostSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Post", PostSchema);
