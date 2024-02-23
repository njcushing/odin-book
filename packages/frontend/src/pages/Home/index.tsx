import { Outlet } from "react-router-dom";
import LayoutUI from "@/layouts";
import Posts from "@/features/posts";
import Infobar from "@/features/infobar";
import styles from "./index.module.css";

export const routes = [
    {
        path: "",
        element: <Posts.List />,
        errorElement: <div></div>,
    },
];

function Home() {
    const layout = (
        <LayoutUI.Spatial
            width="100%"
            height="100%"
            arrangements={[
                {
                    type: "columns",
                    minWidth: 920,
                    maxWidth: 999999,
                    minHeight: 0,
                    maxHeight: 999999,
                    areas: [
                        { size: "600px", children: [<Outlet key={0} />] },
                        { size: "320px", children: [<Infobar.Home key={0} />] },
                    ],
                    style: {
                        justifySelf: "flex-start",
                        alignSelf: "flex-start",
                        width: "1200px",
                        height: "100%",
                        padding: "0rem",
                    },
                },
                {
                    type: "columns",
                    minWidth: 600,
                    maxWidth: 920,
                    minHeight: 0,
                    maxHeight: 999999,
                    areas: [{ size: "600px", children: [<Outlet key={0} />] }],
                    style: {
                        justifySelf: "flex-start",
                        alignSelf: "flex-start",
                        width: "660px",
                        height: "100%",
                        padding: "0rem",
                    },
                },
                {
                    type: "columns",
                    minWidth: 300,
                    maxWidth: 600,
                    minHeight: 0,
                    maxHeight: 999999,
                    areas: [{ size: "300px", children: [<Outlet key={0} />] }],
                    style: {
                        justifySelf: "flex-start",
                        alignSelf: "flex-start",
                        width: "360px",
                        height: "100%",
                        padding: "0rem",
                    },
                },
                {
                    type: "columns",
                    minWidth: 0,
                    maxWidth: 360,
                    minHeight: 0,
                    maxHeight: 999999,
                    areas: [{ size: "1fr", children: [<Outlet key={0} />] }],
                    style: {
                        justifySelf: "flex-start",
                        alignSelf: "flex-start",
                        width: "100%",
                        height: "100%",
                        padding: "0rem",
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
