import { Outlet } from "react-router-dom";
import LayoutUI from "@/layouts";
import List from "../List";
import Active from "../Active";
import styles from "./index.module.css";

export const routes = [
    {
        path: "",
        element: <List />,
        errorElement: <div></div>,
    },
    {
        path: ":chatId",
        element: <Active />,
        errorElement: <div></div>,
    },
];

function Panel() {
    return (
        <div className={styles["container"]}>
            <LayoutUI.Spatial
                width="100%"
                height="100%"
                arrangements={[
                    {
                        type: "rows",
                        minWidth: 0,
                        maxWidth: 999999,
                        minHeight: 0,
                        maxHeight: 999999,
                        areas: [{ size: "1fr", children: [<Outlet key={0} />] }],
                        style: {
                            justifySelf: "flex-start",
                            alignSelf: "center",
                            width: "100%",
                            height: "100%",
                            padding: "0rem",
                        },
                    },
                ]}
            />
        </div>
    );
}

export default Panel;
