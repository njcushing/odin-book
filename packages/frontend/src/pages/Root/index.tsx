import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import PubSub from "pubsub-js";
import LayoutUI from "@/layouts";
import UserContextProvider from "@/context/user";
import Sidebar from "@/features/sidebar";
import Posts from "@/features/posts";
import Chat from "@/features/chat";
import mongoose from "mongoose";
import Home, { routes as HomeRoutes } from "../Home";
import Profile, { routes as ProfileRoutes } from "../Profile";
import Chats, { routes as ChatsRoutes } from "../Chats";
import Post, { routes as PostRoutes } from "../Post";
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
        path: "user/:accountTag",
        element: <Profile />,
        children: ProfileRoutes,
        errorElement: <div></div>,
    },
    {
        path: "",
        element: <Chats />,
        children: ChatsRoutes,
        errorElement: <div></div>,
    },
    {
        path: "post",
        element: <Post />,
        children: PostRoutes,
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
    const [modal, setModal] = useState<React.ReactNode | null>(null);

    useEffect(() => {
        PubSub.subscribe("create-new-post-button-click", () => {
            setModal(
                <Posts.Create
                    onCloseClickHandler={() => setModal(null)}
                    onSuccessHandler={() => setModal(null)}
                />,
            );
        });
        PubSub.subscribe("create-new-reply-button-click", (msg, data) => {
            setModal(
                <Posts.Create
                    replyingTo={data as unknown as mongoose.Types.ObjectId}
                    onCloseClickHandler={() => setModal(null)}
                    onSuccessHandler={() => setModal(null)}
                />,
            );
        });
        PubSub.subscribe("create-new-chat-button-click", () => {
            setModal(
                <Chat.Create
                    onCloseClickHandler={() => setModal(null)}
                    onSuccessHandler={() => setModal(null)}
                />,
            );
        });
        PubSub.subscribe("add-users-to-chat-button-click", (msg, data) => {
            setModal(
                <Chat.AddUsers
                    chatId={data.chatId}
                    onCloseClickHandler={() => setModal(null)}
                    onSuccessHandler={() => setModal(null)}
                />,
            );
        });

        return () => {
            PubSub.unsubscribe("create-new-post-button-click");
            PubSub.unsubscribe("create-new-reply-button-click");
            PubSub.unsubscribe("create-new-chat-button-click");
            PubSub.unsubscribe("add-users-to-chat-button-click");
        };
    }, []);

    const layout = (
        <LayoutUI.Spatial
            width="auto"
            height="auto"
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
                        height: "auto",
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
                        height: "auto",
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
                        height: "auto",
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
                        height: "auto",
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
                        height: "auto",
                        padding: "0rem",
                    },
                },
            ]}
        />
    );

    return (
        <UserContextProvider>
            <div className={styles["wrapper"]}>
                <div className={styles["container"]}>
                    {layout}
                    {modal}
                </div>
            </div>
        </UserContextProvider>
    );
}

export default Root;
