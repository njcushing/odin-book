import LayoutUI from "@/layouts";
import Buttons from "@/components/buttons";
import * as mockData from "@/mockData";
import styles from "./index.module.css";

function List() {
    const chats = mockData.chats(10);

    const buttons = (
        <div className={styles["create-new-chat-button-container"]} key={0}>
            <Buttons.Basic
                text="New"
                symbol="add"
                palette="green"
                otherStyles={{
                    fontSize: "1.15rem",
                    padding: "0.8rem 1.6rem",
                }}
            />
        </div>
    );

    const chatsList = (
        <LayoutUI.List
            label="navigation"
            ordered={false}
            listItems={chats.map((chat) => chat)}
            scrollable
            listStyles={{
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                flexWrap: "nowrap",
                gap: "0.2rem",
                width: "calc(100% - (2 * 0.4rem))",
                height: "auto",
                padding: "0.4rem",
                margin: "0rem",
            }}
            key={0}
        />
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
                            { size: "auto", children: [buttons] },
                            { size: "1fr", children: [chatsList] },
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

export default List;
