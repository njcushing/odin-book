import { createBrowserRouter, RouterProvider } from "react-router-dom";

function Router() {
    const browserRouter = createBrowserRouter([
        {
            path: "/",
            element: <div></div>,
            errorElement: <div></div>,
        },
    ]);

    return <RouterProvider router={browserRouter} />;
}

export default Router;
