import Root, { routes as RootRoutes } from "./Root";
import CreateAccount from "./CreateAccount";
import Login from "./Login";
import Auth, { routes as AuthRoutes } from "./Auth";
import Home, { routes as HomeRoutes } from "./Home";
import Profile, { routes as ProfileRoutes } from "./Profile";
import Chats, { routes as ChatsRoutes } from "./Chats";
import Settings, { routes as SettingsRoutes } from "./Settings";

const Page = {
    Root,
    CreateAccount,
    Login,
    Auth,
    Home,
    Profile,
    Chats,
    Settings,
};

export default Page;

export const Routes = {
    Root: RootRoutes,
    Auth: AuthRoutes,
    Home: HomeRoutes,
    Profile: ProfileRoutes,
    Chats: ChatsRoutes,
    Settings: SettingsRoutes,
};
