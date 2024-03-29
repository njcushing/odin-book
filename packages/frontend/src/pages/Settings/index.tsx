import { Outlet } from "react-router-dom";
import LayoutUI from "@/layouts";
import SettingsComponents, { Routes } from "@/features/settings";
import Infobar from "@/features/infobar";
import styles from "./index.module.css";

export const routes = [
    {
        path: "",
        element: <SettingsComponents.Main />,
        children: Routes.Main,
        errorElement: <div></div>,
    },
];

function Settings() {
    const layout = (
        <LayoutUI.Spatial
            width="100%"
            height="auto"
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
                        height: "auto",
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
                        height: "auto",
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
                        height: "auto",
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
                        height: "auto",
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

export default Settings;
