import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Page, { Routes } from "@/pages";

function Router() {
    const browserRouter = createBrowserRouter([
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
