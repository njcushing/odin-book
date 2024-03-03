import * as ModelTypes from "@/utils/modelTypes";

export type User = Pick<ModelTypes.User, "_id" | "accountTag"> & {
    preferences: Pick<ModelTypes.User["preferences"], "displayName" | "profileImage">;
};

const findUserFromTag = (tag: string): User => {
    return {
        _id: "1",
        accountTag: "JohnSmith84",
        preferences: {
            displayName: "John Smith",
            profileImage: { src: new Uint8Array([]), alt: "" },
        },
    };
};

export default findUserFromTag;
