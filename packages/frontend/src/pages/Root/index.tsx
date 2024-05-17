import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import PubSub from "pubsub-js";
import LayoutUI from "@/layouts";
import UserContextProvider from "@/context/user";
import Sidebar from "@/features/sidebar";
import Posts from "@/features/posts";
import Chat from "@/features/chat";
import Infobar from "@/features/infobar";
import mongoose from "mongoose";
import Profile from "@/features/profile";
import { routes as ProfileRoutes } from "@/features/profile/Main";
import Settings from "@/features/settings";
import { routes as SettingsRoutes } from "@/features/settings/Main";
import styles from "./index.module.css";

export const routes = [
    {
        path: "",
        element: <Posts.List />,
        errorElement: <div></div>,
    },
    {
        path: "user/:accountTag",
        element: <Profile.Main />,
        children: ProfileRoutes,
        errorElement: <div></div>,
    },
    {
        path: "",
        children: [
            {
                path: "chats",
                element: <Chat.List />,
                errorElement: <div></div>,
            },
            {
                path: "chat/:chatId",
                element: <Chat.Active getIdFromURLParam />,
                errorElement: <div></div>,
            },
        ],
        errorElement: <div></div>,
    },
    {
        path: "post",
        children: [
            {
                path: ":postId",
                element: (
                    <div className={styles["post-container"]}>
                        <Posts.Replies getIdFromURLParam canLoadMoreReplies disableRepliesLink />
                    </div>
                ),
                errorElement: <div></div>,
            },
            {
                path: ":postId/likes",
                element: <Posts.Likes getIdFromURLParam />,
                errorElement: <div></div>,
            },
        ],
        errorElement: <div></div>,
    },
    {
        path: "settings",
        element: <Settings.Main />,
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
        PubSub.subscribe("update-chat-image-button-click", (msg, data) => {
            setModal(
                <Chat.UpdateImage
                    chatData={data.chatData}
                    participantsInfo={data.participantsInfo}
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
            PubSub.unsubscribe("update-chat-image-button-click");
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
                        { size: "1fr", children: [<Outlet key={0} />] },
                        {
                            size: "auto",
                            children: [
                                <Infobar.Wrapper
                                    style={{ gap: "0.4rem", padding: "0.4rem" }}
                                    key={0}
                                />,
                            ],
                        },
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
                        { size: "1fr", children: [<Outlet key={0} />] },
                        {
                            size: "auto",
                            children: [
                                <Infobar.Wrapper
                                    style={{ gap: "0.4rem", padding: "0.4rem" }}
                                    key={0}
                                />,
                            ],
                        },
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
