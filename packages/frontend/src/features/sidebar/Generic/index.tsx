import { useContext } from "react";
import Profile from "@/features/profile";
import { UserContext } from "@/context/user";
import Navigation from "@/components/navigation";
import styles from "./index.module.css";

type GenericTypes = {
    type: "wide" | "thin";
};

function Generic({ type }: GenericTypes) {
    const { extract } = useContext(UserContext);

    const navMenuOptions = [
        { text: "Home", symbol: "home", link: "/" },
        { text: "Profile", symbol: "person", link: `/user/${extract("accountTag")}` },
        { text: "Chats", symbol: "message", link: "/chats" },
        { text: "Settings", symbol: "settings", link: "/settings" },
    ];

    return (
        <div className={styles["wrapper"]}>
            <div className={styles["container"]}>
                <Profile.Sidebar type={type} />
                <Navigation.Menu type={type} options={navMenuOptions} />
            </div>
        </div>
    );
}

export default Generic;
