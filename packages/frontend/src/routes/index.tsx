import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root, { routes } from "./Root";

function Router() {
    const browserRouter = createBrowserRouter([
        {
            path: "/",
            element: <Root />,
            children: routes,
            errorElement: <div></div>,
        },
    ]);

    return <RouterProvider router={browserRouter} />;
}

export default Router;
