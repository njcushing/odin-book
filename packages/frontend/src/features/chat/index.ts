import Panel, { routes as PanelRoutes } from "./Panel";
import Header from "./Header";
import List from "./List";
import Option from "./Option";
import Active from "./Active";
import Message from "./Message";
import Create from "./Create";
import AddUsers from "./AddUsers";

const Chat = {
    Panel,
    Header,
    List,
    Option,
    Active,
    Message,
    Create,
    AddUsers,
};

export default Chat;

export const Routes = {
    Panel: PanelRoutes,
};
