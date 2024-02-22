import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Page from "@/pages";
import Chats from "@/pages/Chats";

function Router() {
    const browserRouter = createBrowserRouter([
        {
            path: "/",
            element: <Page.Root />,
            children: [...home(), ...profile(), ...chats(), ...settings()],
            errorElement: <div></div>,
        },
    ]);

    return <RouterProvider router={browserRouter} />;
}

const home = () => {
    return [
        {
            path: "",
            element: <Page.Home />,
            errorElement: <div></div>,
        },
    ];
};

const profile = () => {
    return [
        {
            path: ":accountTag",
            element: <Page.Profile />,
            errorElement: <div></div>,
        },
    ];
};

const chats = () => {
    return [
        {
            path: "chats",
            element: <Page.Chats />,
            errorElement: <div></div>,
        },
    ];
};

const settings = () => {
    return [
        {
            path: "settings",
            element: <Page.Settings />,
            errorElement: <div></div>,
        },
    ];
};

export default Router;
