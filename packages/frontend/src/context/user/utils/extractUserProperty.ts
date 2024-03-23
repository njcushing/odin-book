import { UserTypes } from "..";

const extractUserProperty = (user: UserTypes, property: string): unknown => {
    switch (property) {
        case "_id":
            return user && user._id ? user._id : "";
        case "accountTag":
            return user && user.accountTag ? user.accountTag : "";
        case "githubId":
            return user && user.githubId ? user.githubId : "";
        case "email":
            return user && user.email ? user.email : "";
        case "password":
            return user && user.password ? user.password : "";
        case "admin":
            return user && user.admin ? user.admin : "";
        case "following":
            return user && user.following ? user.following : {};
        case "following.users":
            return user && user.following && user.following.users ? user.following.users : [];
        case "following.requests":
            return user && user.following && user.following.requests ? user.following.requests : [];
        case "followers":
            return user && user.followers ? user.followers : {};
        case "followers.users":
            return user && user.followers && user.followers.users ? user.followers.users : [];
        case "followers.requests":
            return user && user.followers && user.followers.requests ? user.followers.requests : [];
        case "posts":
            return user && user.posts ? user.posts : [];
        case "chats":
            return user && user.chats ? user.chats : [];
        case "preferences":
            return user && user.preferences ? user.preferences : {};
        case "preferences.displayName":
            return user && user.preferences && user.preferences.displayName
                ? user.preferences.displayName
                : "";
        case "preferences.bio":
            return user && user.preferences && user.preferences.bio ? user.preferences.bio : "";
        case "preferences.profileImage":
            return user && user.preferences && user.preferences.profileImage
                ? user.preferences.profileImage
                : "";
        case "preferences.theme":
            return user && user.preferences && user.preferences.theme
                ? user.preferences.theme
                : "default";
        default:
            return null;
    }
};

export default extractUserProperty;
