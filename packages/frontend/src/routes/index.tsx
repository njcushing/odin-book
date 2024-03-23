import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Page, { Routes } from "@/pages";

function Router() {
    const browserRouter = createBrowserRouter([
        {
            path: "/create-account",
            element: <Page.CreateAccount />,
            errorElement: <div></div>,
        },
        {
            path: "/login",
            element: <Page.Login />,
            errorElement: <div></div>,
        },
        {
            path: "/auth",
            element: <Page.Auth />,
            children: Routes.Auth,
            errorElement: <div></div>,
        },
        {
            path: "/",
            element: <Page.Root />,
            children: Routes.Root,
            errorElement: <div></div>,
        },
    ]);

    return <RouterProvider router={browserRouter} />;
}

export default Router;
