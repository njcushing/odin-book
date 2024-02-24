import * as extendedTypes from "@/utils/extendedTypes";

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
    author: string;
    content: { text: string; images: { src: extendedTypes.TypedArray; alt: string }[] };
    replyingTo?: string | null;
};
