import { Outlet, Navigate } from "react-router-dom";
import LayoutUI from "@/layouts";
import Navigation from "@/components/navigation";
import Sections from "../utils/Sections";
import styles from "./index.module.css";

export const routes = [
    {
        path: "",
        element: <Navigate to="account" />,
        errorElement: <div></div>,
    },
    {
        path: "account",
        element: <Sections.Account />,
        errorElement: <div></div>,
    },
    {
        path: "preferences",
        element: <Sections.Preferences />,
        errorElement: <div></div>,
    },
    {
        path: "profile",
        element: <Sections.Profile />,
        errorElement: <div></div>,
    },
];

function Main() {
    const optionStyles = {
        gap: "0.4rem",
        fontSize: "1.2rem",
        padding: "0.3rem 0.4rem",
    };

    const navigationOptions = [
        { text: "Account", symbol: "lock", link: "account", style: optionStyles },
        { text: "Preferences", symbol: "palette", link: "preferences", style: optionStyles },
        { text: "Profile", symbol: "person", link: "profile", style: optionStyles },
    ];

    const navigation = (
        <div className={styles["navigation-wrapper"]} key={0}>
            <div className={styles["navigation-container"]}>
                <Navigation.Menu type="wide" options={navigationOptions} />
            </div>
        </div>
    );

    return (
        <div className={styles["container"]}>
            <LayoutUI.Spatial
                width="100%"
                height="100%"
                arrangements={[
                    {
                        type: "columns",
                        minWidth: 0,
                        maxWidth: 999999,
                        minHeight: 0,
                        maxHeight: 999999,
                        areas: [
                            {
                                size: "40%",
                                children: [
                                    <LayoutUI.List
                                        label="settings"
                                        ordered={false}
                                        listItems={[navigation]}
                                        scrollable
                                        listStyles={{
                                            width: "100%",
                                            height: "100%",
                                        }}
                                        key={0}
                                    />,
                                ],
                            },
                            {
                                size: "60%",
                                children: [
                                    <LayoutUI.List
                                        label="settings"
                                        ordered={false}
                                        listItems={[
                                            <div className={styles["right-panel"]} key={0}>
                                                <Outlet />
                                            </div>,
                                        ]}
                                        scrollable
                                        listStyles={{
                                            width: "100%",
                                            height: "max-content",
                                        }}
                                        key={0}
                                    />,
                                ],
                            },
                        ],
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

export default Main;
