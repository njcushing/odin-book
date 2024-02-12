import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Page from "@/pages";

function Router() {
    const browserRouter = createBrowserRouter([
        {
            path: "/",
            element: <Page.Home />,
            errorElement: <div></div>,
        },
    ]);

    return <RouterProvider router={browserRouter} />;
}

export default Router;
