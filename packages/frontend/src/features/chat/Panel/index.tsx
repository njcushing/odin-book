import LayoutUI from "@/layouts";
import Inputs from "@/components/inputs";
import Buttons from "@/components/buttons";
import Chat from "..";
import styles from "./index.module.css";

function Panel() {
    const messages = [
        true,
        false,
        false,
        true,
        false,
        false,
        true,
        true,
        false,
        false,
        true,
        true,
        false,
        false,
        true,
        true,
        false,
        false,
        true,
        true,
        false,
        false,
        true,
        true,
    ];

    const messageList = (
        <div className={styles["message-list-container"]} key={0}>
            <LayoutUI.List
                label="navigation"
                ordered={false}
                listItems={messages.map((message, i) => {
                    return (
                        <Chat.Message
                            author={{ self: message, displayName: "Greg" }}
                            content={{ text: "Hello" }}
                            key={i}
                        />
                    );
                })}
                scrollable
                listStyles={{
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    gap: "0.4rem",
                    width: "calc(100% - (2 * 0.4rem))",
                    height: "auto",
                    padding: "0.4rem",
                    margin: "0rem",
                }}
            />
        </div>
    );

    const messageBox = (
        <div className={styles["message-box-container"]} key={0}>
            <Inputs.Message placeholder="Type your message..." />
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
                            { size: "auto", children: [<Chat.Header key={0} />] },
                            { size: "1fr", children: [messageList] },
                            { size: "auto", children: [messageBox] },
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
