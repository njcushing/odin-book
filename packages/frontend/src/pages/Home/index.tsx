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
                    minWidth: 1200,
                    maxWidth: 999999,
                    minHeight: 0,
                    maxHeight: 999999,
                    areas: [
                        { size: "280px", children: [<Sidebar.Generic type="wide" key={0} />] },
                        { size: "600px", children: [main] },
                        { size: "320px", children: [otherContent] },
                    ],
                    style: {
                        justifySelf: "flex-start",
                        alignSelf: "center",
                        width: "calc(1200px - (2 * 0.6rem))",
                        height: "calc(100% - (2 * 0.6rem))",
                        padding: "0.6rem",
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
                        { size: "600px", children: [main] },
                        { size: "320px", children: [otherContent] },
                    ],
                    style: {
                        justifySelf: "flex-start",
                        alignSelf: "center",
                        width: "calc(980px - (2 * 0.6rem))",
                        height: "calc(100% - (2 * 0.6rem))",
                        padding: "0.6rem",
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
                        { size: "600px", children: [main] },
                    ],
                    style: {
                        justifySelf: "flex-start",
                        alignSelf: "center",
                        width: "calc(660px - (2 * 0.6rem))",
                        height: "calc(100% - (2 * 0.6rem))",
                        padding: "0.6rem",
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
                        { size: "300px", children: [main] },
                    ],
                    style: {
                        justifySelf: "flex-start",
                        alignSelf: "center",
                        width: "calc(360px - (2 * 0.6rem))",
                        height: "calc(100% - (2 * 0.6rem))",
                        padding: "0.6rem",
                    },
                },
                {
                    type: "columns",
                    width: "100%",
                    minWidth: 0,
                    maxWidth: 360,
                    height: "100%",
                    minHeight: 0,
                    maxHeight: 999999,
                    areas: [
                        { size: "60px", children: [<Sidebar.Generic type="thin" key={0} />] },
                        { size: "1fr", children: [main] },
                    ],
                    style: {
                        justifySelf: "flex-start",
                        alignSelf: "flex-start",
                        width: "calc(100% - (2 * 0.6rem))",
                        height: "calc(100% - (2 * 0.6rem))",
                        padding: "0.6rem",
                    },
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
