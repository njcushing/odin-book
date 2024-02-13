import LayoutUI from "@/layouts";
import Navigation from "@/features/navigation";

type MenuProps = {
    type: "wide" | "thin",
};

function Menu({ type }: MenuProps) {
    const optionStyles = {
        gap: "1rem",
        width: type === "wide" ? "100%" : "auto"
    }
    const options = [
        { text: "Home", symbol: "home", link: "/" },
        { text: "Profile", symbol: "person", link: "/profile" },
        { text: "Chats", symbol: "message", link: "/chats" }
    ];

    return (
        <LayoutUI.List
            label="navigation"
            ordered={false}
            listItems={
                options.map((option, i) => {
                    return (<Navigation.Option
                        text={type === "wide" ? option.text : ""}
                        symbol={option.symbol}
                        link={option.link}
                        style={optionStyles}
                        key={i}
                    />);
                })
            }
            scrollable
            listStyles={{
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: type === "wide" ? "flex-start" : "center",
                flexWrap: "nowrap",
                gap: "0.2rem",
                width: type === "wide" ? "100%" : "auto",
                height: "auto",
                padding: "0.3rem",
                margin: "0rem",
            }}
        />
    );
}

export default Menu;
