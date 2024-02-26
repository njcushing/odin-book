import LayoutUI from "@/layouts";
import Navigation from "@/features/navigation";
import styles from "./index.module.css";

type MenuProps = {
    type: "wide" | "thin";
};

function Menu({ type }: MenuProps) {
    const optionStyles = {
        gap: "1rem",
        width: type === "wide" ? "100%" : "auto",
    };
    const options = [
        { text: "Home", symbol: "home", link: "/" },
        { text: "Profile", symbol: "person", link: "/user/username" },
        { text: "Chats", symbol: "message", link: "/chats" },
        { text: "Settings", symbol: "settings", link: "/settings" },
    ];

    return (
        <nav className={styles["nav"]}>
            <LayoutUI.List
                label="navigation"
                ordered={false}
                listItems={options.map((option) => {
                    return (
                        <Navigation.Option
                            text={type === "wide" ? option.text : ""}
                            symbol={option.symbol}
                            link={option.link}
                            style={optionStyles}
                            key={option.text}
                        />
                    );
                })}
                scrollable
                listStyles={{
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: type === "wide" ? "flex-start" : "center",
                    flexWrap: "nowrap",
                    gap: "0.2rem",
                    width: type === "wide" ? "100%" : "auto",
                    height: "auto",
                    margin: "0rem",
                }}
            />
        </nav>
    );
}

export default Menu;
