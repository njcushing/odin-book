import LayoutUI from "@/layouts";
import Navigation from "@/features/navigation";
import Chat from "..";
import * as mockData from "@/mockData";
import styles from "./index.module.css";

function Panel() {
    const navigation = (
        <div className={styles["navigation-container"]} key={0}>
            <Navigation.TopBar
                options={[
                    { text: "test 1" },
                    { text: "test 2" },
                    { text: "test 3" },
                    { text: "test 4" },
                ]}
                activeOption="test 1"
            />
        </div>
    );

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
                        areas: [
                            { size: "auto", children: [navigation] },
                            { size: "1fr", children: [<Chat.Active key={0} />] },
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

export default Panel;
