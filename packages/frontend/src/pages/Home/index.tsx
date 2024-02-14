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
                        { size: "280px", children: [<Sidebar.Generic type="wide" key={0} />] },
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
                        { size: "60px", children: [<Sidebar.Generic type="thin" key={0} />] },
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
                        { size: "60px", children: [<Sidebar.Generic type="thin" key={0} />] },
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
                        { size: "60px", children: [<Sidebar.Generic type="thin" key={0} />] },
                        { size: "300px", children: [main] },
                    ],
                    justifySelf: "flex-start",
                    alignSelf: "center",
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
                    justifySelf: "flex-start",
                    alignSelf: "flex-start",
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
