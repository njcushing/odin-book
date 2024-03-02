import Profile from "@/features/profile";
import Navigation from "@/components/navigation";
import styles from "./index.module.css";

type GenericTypes = {
    type: "wide" | "thin";
};

function Generic({ type }: GenericTypes) {
    const navMenuOptions = [
        { text: "Home", symbol: "home", link: "/" },
        { text: "Profile", symbol: "person", link: "/user/username" },
        { text: "Chats", symbol: "message", link: "/chats" },
        { text: "Settings", symbol: "settings", link: "/settings" },
    ];

    if (type === "wide") {
        return (
            <div className={styles["container"]}>
                <Profile.Sidebar type="wide" />
                <Navigation.Menu type="wide" options={navMenuOptions} />
            </div>
        );
    }

    if (type === "thin") {
        return (
            <div className={styles["container"]}>
                <Profile.Sidebar type="thin" />
                <Navigation.Menu type="thin" options={navMenuOptions} />
            </div>
        );
    }
}

export default Generic;
