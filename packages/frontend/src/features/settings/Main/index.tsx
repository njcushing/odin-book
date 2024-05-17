import { Outlet, Navigate } from "react-router-dom";
import LayoutUI from "@/layouts";
import Navigation from "@/components/navigation";
import Profile from "../Profile";
import Preferences from "../Preferences";
import styles from "./index.module.css";

export const routes = [
    {
        path: "",
        element: <Navigate to="profile" />,
        errorElement: <div></div>,
    },
    {
        path: "preferences",
        element: <Preferences />,
        errorElement: <div></div>,
    },
    {
        path: "profile",
        element: <Profile />,
        errorElement: <div></div>,
    },
];

function Main() {
    const optionStyles = {
        gap: "0.4rem",
        fontSize: "1.2rem",
        padding: "0.16rem 0.4rem",
    };

    const navigationOptions = [
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
                                size: "36%",
                                children: [navigation],
                            },
                            {
                                size: "64%",
                                children: [
                                    <div className={styles["right-panel"]} key={0}>
                                        <Outlet />
                                    </div>,
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
