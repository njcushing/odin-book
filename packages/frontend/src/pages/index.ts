import Home, { routes as HomeRoutes } from "./Home";
import Profile, { routes as ProfileRoutes } from "./Profile";
import Chats, { routes as ChatsRoutes } from "./Chats";
import Settings, { routes as SettingsRoutes } from "./Settings";

const Page = {
    Home,
    Profile,
    Chats,
    Settings,
};

export default Page;

export const Routes = {
    Home: HomeRoutes,
    Profile: ProfileRoutes,
    Chats: ChatsRoutes,
    Settings: SettingsRoutes,
};
