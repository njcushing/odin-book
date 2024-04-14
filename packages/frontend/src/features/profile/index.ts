import Main, { routes as MainRoutes } from "./Main";
import Summary from "./Summary";
import UserPosts from "./UserPosts";
import UserLikes from "./UserLikes";
import UserFollowers from "./UserFollowers";
import UserFollowing from "./UserFollowing";
import Sidebar from "./Sidebar";

const Profile = {
    Main,
    Summary,
    UserPosts,
    Sidebar,
    UserLikes,
    UserFollowers,
    UserFollowing,
};

export default Profile;

export const Routes = {
    Main: MainRoutes,
};
