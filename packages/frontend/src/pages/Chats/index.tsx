import { Outlet } from "react-router-dom";
import Chat from "@/features/chat";
import styles from "./index.module.css";

export const routes = [
    {
        path: "/chats",
        element: <Chat.List />,
        errorElement: <div></div>,
    },
    {
        path: "/chat/:chatId",
        element: <Chat.Active getIdFromURLParam />,
        errorElement: <div></div>,
    },
];

function Chats() {
    return (
        <div className={styles["wrapper"]}>
            <div className={styles["container"]}>
                <Outlet />
            </div>
        </div>
    );
}

export default Chats;
