import mongoose, { Schema, Document } from "mongoose";
import * as validateUser from "@shared/validation/user";

export type TUser = {
    type: "regular" | "guest";
    accountTag: string;
    githubId?: string;
    email?: string;
    password?: string;
    admin: boolean;
    following: {
        users: Array<{
            user: mongoose.Types.ObjectId;
            followingSinceDate: Date;
        }>;
        requests: mongoose.Types.ObjectId[];
    };
    followers: {
        users: Array<{
            user: mongoose.Types.ObjectId;
        }>;
        requests: mongoose.Types.ObjectId[];
    };
    posts: mongoose.Types.ObjectId[];
    likes: mongoose.Types.ObjectId[];
    chats: mongoose.Types.ObjectId[];
    preferences: {
        displayName: string;
        bio: string;
        profileImage?: mongoose.Types.ObjectId;
        headerImage?: mongoose.Types.ObjectId;
        theme: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
};

export interface IUser extends TUser, Document {}

const UserSchema: Schema = new Schema(
    {
        type: {
            type: String,
            enum: ["regular", "guest"],
            require: true,
        },
        accountTag: {
            type: String,
            trim: true,
            unique: true,
            validate: {
                validator(value: string) {
                    return validateUser.accountTag(value, "back").status;
                },
                message: (props: { value: string }) =>
                    validateUser.accountTag(props.value, "back").message,
            },
            required: [true, "'accountTag' field required"],
        },
        githubId: { type: String, unique: true, sparse: true },
        email: {
            type: String,
            trim: true,
            unique: true,
            validate: {
                validator(value: string) {
                    return validateUser.email(value, "back").status;
                },
                message: (props: { value: string }) =>
                    validateUser.email(props.value, "back").message,
            },
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
        likes: [{ type: Schema.Types.ObjectId, ref: "Post" }],
        chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
        preferences: {
            displayName: {
                type: String,
                trim: true,
                validate: {
                    validator(value: string) {
                        return validateUser.displayName(value, "back").status;
                    },
                    message: (props: { value: string }) =>
                        validateUser.displayName(props.value, "back").message,
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
                    message: (props: { value: string }) =>
                        validateUser.bio(props.value, "back").message,
                },
                default: "",
            },
            profileImage: {
                type: Schema.Types.ObjectId,
                ref: "Image",
                default: null,
            },
            headerImage: {
                type: Schema.Types.ObjectId,
                ref: "Image",
                default: null,
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

/* eslint-disable func-names */
UserSchema.virtual("followingCount").get(function (this: IUser) {
    if (!this.following || !("users" in this.following)) return 0;
    return this.following.users.length;
});

UserSchema.virtual("followingRequestCount").get(function (this: IUser) {
    if (!this.following || !("requests" in this.following)) return 0;
    return this.following.requests.length;
});

UserSchema.virtual("followersCount").get(function (this: IUser) {
    if (!this.followers || !("users" in this.followers)) return 0;
    return this.followers.users.length;
});

UserSchema.virtual("followersRequestCount").get(function (this: IUser) {
    if (!this.followers || !("requests" in this.followers)) return 0;
    return this.followers.requests.length;
});

UserSchema.virtual("postCount").get(function (this: IUser) {
    return this.posts.length;
});

UserSchema.virtual("likeCount").get(function (this: IUser) {
    return this.likes.length;
});
/* eslint-enable func-names */

export default mongoose.model<IUser>("User", UserSchema);
