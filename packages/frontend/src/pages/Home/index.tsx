import LayoutUI from "@/layouts";
import Navigation from "@/features/navigation";
import styles from "./index.module.css";

function Home() {
    const main = null;
    const otherContent = null;

    const navOptionsWideStyles = { gap: "1rem" };
    const navOptionsWide = [
        <Navigation.Option
            text="Home"
            symbol="home"
            link="/"
            style={navOptionsWideStyles}
            key={0}
        />,
        <Navigation.Option
            text="Profile"
            symbol="person"
            link="/profile"
            style={navOptionsWideStyles}
            key={1}
        />,
        <Navigation.Option
            text="Chats"
            symbol="message"
            link="/chats"
            style={navOptionsWideStyles}
            key={2}
        />,
    ];
    const navOptionsThinStyles = { gap: "1rem", width: "auto" };
    const navOptionsThin = [
        <Navigation.Option symbol="home" link="/" style={navOptionsThinStyles} key={0} />,
        <Navigation.Option symbol="person" link="/profile" style={navOptionsThinStyles} key={1} />,
        <Navigation.Option symbol="message" link="/chats" style={navOptionsThinStyles} key={2} />,
    ];

    const navWide = (
        <LayoutUI.List
            label="navigation"
            ordered={false}
            listItems={navOptionsWide}
            scrollable
            listStyles={{
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                flexWrap: "nowrap",
                gap: "0.2rem",
                width: "100%",
                height: "auto",
                padding: "0.3rem",
                margin: "0rem",
            }}
        />
    );

    const navThin = (
        <LayoutUI.List
            label="navigation"
            ordered={false}
            listItems={navOptionsThin}
            scrollable
            listStyles={{
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                flexWrap: "nowrap",
                gap: "0.2rem",
                width: "auto",
                height: "auto",
                padding: "0.3rem",
                margin: "0rem",
            }}
        />
    );

    const layout = (
        <LayoutUI.Spatial
            width="auto"
            height="100%"
            arrangements={[
                {
                    type: "columns",
                    width: "1200px",
                    minWidth: 1200,
                    maxWidth: 999999,
                    height: "100%",
                    minHeight: 0,
                    maxHeight: 999999,
                    areas: [
                        { size: "280px", children: [navWide] },
                        { size: "600px", children: [main] },
                        { size: "320px", children: [otherContent] },
                    ],
                    justifySelf: "flex-start",
                    alignSelf: "center",
                },
                {
                    type: "columns",
                    width: "980px",
                    minWidth: 980,
                    maxWidth: 1200,
                    height: "100%",
                    minHeight: 0,
                    maxHeight: 999999,
                    areas: [
                        { size: "60px", children: [navThin] },
                        { size: "600px", children: [main] },
                        { size: "320px", children: [otherContent] },
                    ],
                    justifySelf: "flex-start",
                    alignSelf: "center",
                },
                {
                    type: "columns",
                    width: "660px",
                    minWidth: 660,
                    maxWidth: 980,
                    height: "100%",
                    minHeight: 0,
                    maxHeight: 999999,
                    areas: [
                        { size: "60px", children: [navThin] },
                        { size: "600px", children: [main] },
                    ],
                    justifySelf: "flex-start",
                    alignSelf: "center",
                },
                {
                    type: "columns",
                    width: "360px",
                    minWidth: 360,
                    maxWidth: 660,
                    height: "100%",
                    minHeight: 0,
                    maxHeight: 999999,
                    areas: [
                        { size: "60px", children: [navThin] },
                        { size: "300px", children: [main] },
                    ],
                    justifySelf: "flex-start",
                    alignSelf: "center",
                },
                {
                    type: "columns",
                    width: "320px",
                    minWidth: 0,
                    maxWidth: 360,
                    height: "100%",
                    minHeight: 0,
                    maxHeight: 999999,
                    areas: [
                        { size: "60px", children: [navThin] },
                        { size: "260px", children: [main] },
                    ],
                    justifySelf: "flex-start",
                    alignSelf: "center",
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

export default Home;
