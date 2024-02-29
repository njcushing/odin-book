import Root, { routes as RootRoutes } from "./Root";
import CreateAccount from "./CreateAccount";
import Login from "./Login";
import Home, { routes as HomeRoutes } from "./Home";
import Profile, { routes as ProfileRoutes } from "./Profile";
import Chats, { routes as ChatsRoutes } from "./Chats";
import Settings, { routes as SettingsRoutes } from "./Settings";

const Page = {
    Root,
    CreateAccount,
    Login,
    Home,
    Profile,
    Chats,
    Settings,
};

export default Page;

export const Routes = {
    Root: RootRoutes,
    Home: HomeRoutes,
    Profile: ProfileRoutes,
    Chats: ChatsRoutes,
    Settings: SettingsRoutes,
};
