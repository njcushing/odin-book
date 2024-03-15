import mongoose from "mongoose";
import * as validateUser from "@shared/validation/user";

const { Schema } = mongoose;

const UserSchema = new Schema(
    {
        accountTag: {
            type: String,
            trim: true,
            unique: true,
            validate: {
                validator(value: string) {
                    return validateUser.accountTag(value, "back").status;
                },
                message: (props) => validateUser.accountTag(props.value, "back").message,
            },
            required: [true, "'accountTag' field required"],
        },
        githubId: {
            type: String,
            unique: true,
        },
        email: {
            type: String,
            trim: true,
            unique: true,
            validate: {
                validator(value: string) {
                    return validateUser.email(value, "back").status;
                },
                message: (props) => validateUser.email(props.value, "back").message,
            },
            required: [true, "'email' field required"],
        },
        password: {
            type: String,
            trim: true,
            // Not including validator here because the password is hashed
        },
        admin: {
            type: Boolean,
            required: true,
            default: false,
        },
        following: {
            users: [
                {
                    user: {
                        type: Schema.Types.ObjectId,
                        ref: "User",
                        required: true,
                    },
                    followingSinceDate: { type: Date, default: Date.now },
                },
            ],
            requests: [{ type: Schema.Types.ObjectId, ref: "User" }],
        },
        followers: {
            users: [
                {
                    user: {
                        type: Schema.Types.ObjectId,
                        ref: "User",
                        required: true,
                    },
                },
            ],
            requests: [{ type: Schema.Types.ObjectId, ref: "User" }],
        },
        posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
        chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
        preferences: {
            displayName: {
                type: String,
                trim: true,
                validate: {
                    validator(value: string) {
                        return validateUser.displayName(value, "back").status;
                    },
                    message: (props) => validateUser.displayName(props.value, "back").message,
                },
                default: "",
            },
            bio: {
                type: String,
                trim: true,
                validate: {
                    validator(value: string) {
                        return validateUser.bio(value, "back").status;
                    },
                    message: (props) => validateUser.bio(props.value, "back").message,
                },
                default: "",
            },
            profileImage: {
                type: Schema.Types.ObjectId,
                ref: "Image",
            },
            theme: {
                type: String,
                default: "default",
            },
        },
    },
    {
        getters: true,
        timestamps: true,
    },
);

UserSchema.set("toObject", { virtuals: true });
UserSchema.set("toJSON", { virtuals: true });

export default mongoose.model("User", UserSchema);
