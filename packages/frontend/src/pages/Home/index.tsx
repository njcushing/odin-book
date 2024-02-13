import LayoutUI from "@/layouts";
import Sidebar from "@/features/sidebar";
import styles from "./index.module.css";

function Home() {
    const main = null;
    const otherContent = null;

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
                        { size: "280px", children: [<Sidebar.Wide />] },
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
                        { size: "60px", children: [<Sidebar.Thin />] },
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
                        { size: "60px", children: [<Sidebar.Thin />] },
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
                        { size: "60px", children: [<Sidebar.Thin />] },
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
                        { size: "60px", children: [<Sidebar.Thin />] },
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
