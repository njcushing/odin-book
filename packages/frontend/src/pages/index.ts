import Root, { routes as RootRoutes } from "./Root";
import CreateAccount from "./CreateAccount";
import Login from "./Login";
import Auth, { routes as AuthRoutes } from "./Auth";

const Page = {
    Root,
    CreateAccount,
    Login,
    Auth,
};

export default Page;

export const Routes = {
    Root: RootRoutes,
    Auth: AuthRoutes,
};
