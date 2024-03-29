import * as extendedTypes from "@shared/utils/extendedTypes";

export type Status = "online" | "away" | "busy" | "offline" | null;

export type User = {
    _id: string;
    accountTag: string;
    preferences: {
        displayName: string;
        profileImage: { src: extendedTypes.TypedArray; alt: string };
    };
    status: Status;
};

export type Post = {
    _id: string;
    author: User;
    content: {
        text: string;
        images: { src: extendedTypes.TypedArray; alt: string; key?: React.Key }[];
    };
    likes: string[];
    likesQuantity: number;
    replies: string[];
    repliesQuantity: number;
    replyingTo?: string | null;
};
