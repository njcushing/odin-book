import { UserTypes } from "..";

const extractUserProperty = (user: UserTypes, property: string): unknown => {
    switch (property) {
        case "_id":
            return user._id;
        case "accountTag":
            return user.accountTag;
        case "githubId":
            return user && user.githubId ? user.githubId : "";
        case "email":
            return user && user.email ? user.email : "";
        case "followingCount":
            return user.followingCount;
        case "followingRequestCount":
            return user.followingRequestCount;
        case "followersCount":
            return user.followersCount;
        case "followersRequestCount":
            return user.followersRequestCount;
        case "postCount":
            return user.postCount;
        case "likesCount":
            return user.likesCount;
        case "repliesCount":
            return user.repliesCount;
        case "preferences":
            return user.preferences;
        case "preferences.displayName":
            return user.preferences.displayName;
        case "preferences.bio":
            return user.preferences.bio;
        case "preferences.profileImage":
            return user.preferences.profileImage;
        case "preferences.theme":
            return user.preferences.theme;
        default:
            return null;
    }
};

export default extractUserProperty;
