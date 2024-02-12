import LayoutUI from "@/layouts";
import styles from "./index.module.css";

function Home() {
    const nav = (
        <div
            style={{
                width: "100%",
                height: "100%",
                backgroundColor: "rgb(100, 100, 100)",
            }}
            key={0}
        ></div>
    );
    const main = (
        <div
            style={{
                width: "100%",
                height: "100%",
                backgroundColor: "rgb(60, 60, 60)",
            }}
            key={0}
        ></div>
    );
    const otherContent = nav;

    const layout = (
        <LayoutUI.Spatial
            width="100%"
            height="100%"
            arrangements={[
                {
                    type: "columns",
                    width: "100%",
                    minWidth: 960,
                    maxWidth: 1440,
                    height: "100%",
                    minHeight: 0,
                    maxHeight: 999999,
                    areas: [
                        { size: "25%", children: [nav] },
                        { size: "50%", children: [main] },
                        { size: "25%", children: [otherContent] },
                    ],
                },
                {
                    type: "columns",
                    width: "100%",
                    minWidth: 480,
                    maxWidth: 960,
                    height: "100%",
                    minHeight: 0,
                    maxHeight: 999999,
                    areas: [
                        { size: "25%", children: [nav] },
                        { size: "75%", children: [main] },
                    ],
                },
                {
                    type: "columns",
                    width: "100%",
                    minWidth: 0,
                    maxWidth: 480,
                    height: "100%",
                    minHeight: 0,
                    maxHeight: 999999,
                    areas: [
                        { size: "70px", children: [nav] },
                        { size: "auto", children: [main] },
                    ],
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
