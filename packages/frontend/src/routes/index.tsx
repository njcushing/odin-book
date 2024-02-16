import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Page from "@/pages";

function Router() {
    const browserRouter = createBrowserRouter([
        {
            path: "/",
            element: <Page.Home />,
            errorElement: <div></div>,
        },
        {
            path: "/profile",
            element: <Page.Profile />,
            errorElement: <div></div>,
        },
        {
            path: "/chats",
            element: <Page.Chats />,
            errorElement: <div></div>,
        },
        {
            path: "/settings",
            element: <Page.Settings />,
            errorElement: <div></div>,
        },
    ]);

    return <RouterProvider router={browserRouter} />;
}

export default Router;
