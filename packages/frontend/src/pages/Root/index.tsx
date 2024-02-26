import { Outlet } from "react-router-dom";
import LayoutUI from "@/layouts";
import Sidebar from "@/features/sidebar";
import Home, { routes as HomeRoutes } from "../Home";
import Profile, { routes as ProfileRoutes } from "../Profile";
import Chats, { routes as ChatsRoutes } from "../Chats";
import Settings, { routes as SettingsRoutes } from "../Settings";
import styles from "./index.module.css";

export const routes = [
    {
        path: "",
        element: <Home />,
        children: HomeRoutes,
        errorElement: <div></div>,
    },
    {
        path: ":accountTag",
        element: <Profile />,
        children: ProfileRoutes,
        errorElement: <div></div>,
    },
    {
        path: "chats",
        element: <Chats />,
        children: ChatsRoutes,
        errorElement: <div></div>,
    },
    {
        path: "settings",
        element: <Settings />,
        children: SettingsRoutes,
        errorElement: <div></div>,
    },
];

function Root() {
    const layout = (
        <LayoutUI.Spatial
            width="auto"
            height="100%"
            arrangements={[
                {
                    type: "columns",
                    minWidth: 1200,
                    maxWidth: 999999,
                    minHeight: 0,
                    maxHeight: 999999,
                    areas: [
                        { size: "280px", children: [<Sidebar.Generic type="wide" key={0} />] },
                        { size: "920px", children: [<Outlet key={0} />] },
                    ],
                    style: {
                        justifySelf: "flex-start",
                        alignSelf: "center",
                        width: "1200px",
                        height: "100%",
                        padding: "0rem",
                    },
                },
                {
                    type: "columns",
                    minWidth: 980,
                    maxWidth: 1200,
                    minHeight: 0,
                    maxHeight: 999999,
                    areas: [
                        { size: "60px", children: [<Sidebar.Generic type="thin" key={0} />] },
                        { size: "920px", children: [<Outlet key={0} />] },
                    ],
                    style: {
                        justifySelf: "flex-start",
                        alignSelf: "center",
                        width: "980px",
                        height: "100%",
                        padding: "0rem",
                    },
                },
                {
                    type: "columns",
                    minWidth: 660,
                    maxWidth: 980,
                    minHeight: 0,
                    maxHeight: 999999,
                    areas: [
                        { size: "60px", children: [<Sidebar.Generic type="thin" key={0} />] },
                        { size: "600px", children: [<Outlet key={0} />] },
                    ],
                    style: {
                        justifySelf: "flex-start",
                        alignSelf: "center",
                        width: "660px",
                        height: "100%",
                        padding: "0rem",
                    },
                },
                {
                    type: "columns",
                    minWidth: 360,
                    maxWidth: 660,
                    minHeight: 0,
                    maxHeight: 999999,
                    areas: [
                        { size: "60px", children: [<Sidebar.Generic type="thin" key={0} />] },
                        { size: "300px", children: [<Outlet key={0} />] },
                    ],
                    style: {
                        justifySelf: "flex-start",
                        alignSelf: "center",
                        width: "360px",
                        height: "100%",
                        padding: "0rem",
                    },
                },
                {
                    type: "columns",
                    minWidth: 0,
                    maxWidth: 360,
                    minHeight: 0,
                    maxHeight: 999999,
                    areas: [
                        { size: "60px", children: [<Sidebar.Generic type="thin" key={0} />] },
                        { size: "1fr", children: [<Outlet key={0} />] },
                    ],
                    style: {
                        justifySelf: "flex-start",
                        alignSelf: "flex-start",
                        width: "100%",
                        height: "100%",
                        padding: "0rem",
                    },
                },
            ]}
        />
    );

    return (
        <div className={styles["wrapper"]}>
            <div className={styles["container"]}>{layout}</div>
        </div>
    );
}

export default Root;