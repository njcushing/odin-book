import { Outlet } from "react-router-dom";
import GitHub from "./GitHub";

export const routes = [
    {
        path: "github",
        element: <GitHub />,
        errorElement: <div></div>,
    },
];

function Auth() {
    return <Outlet />;
}

export default Auth;
