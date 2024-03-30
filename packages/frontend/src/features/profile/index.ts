import Main, { routes as MainRoutes } from "./Main";
import Summary from "./Summary";
import UserPosts from "./UserPosts";
import Sidebar from "./Sidebar";

const Profile = {
    Main,
    Summary,
    UserPosts,
    Sidebar,
};

export default Profile;

export const Routes = {
    Main: MainRoutes,
};
