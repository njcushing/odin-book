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
