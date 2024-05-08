import Main, { routes as MainRoutes } from "./Main";
import List from "./List";
import FieldUpdater from "./FieldUpdater";
import Profile from "./Profile";
import Preferences from "./Preferences";

const Settings = {
    Main,
    List,
    FieldUpdater,
    Profile,
    Preferences,
};

export default Settings;

export const Routes = {
    Main: MainRoutes,
};
