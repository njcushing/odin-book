import { useState } from "react";
import LayoutUI from "@/layouts";
import Buttons from "@/components/buttons";
import Inputs from "@/components/inputs";
import Chat from "..";
import * as extendedTypes from "@/utils/extendedTypes";
import * as mockData from "@/mockData";
import styles from "./index.module.css";

function Active() {
    const [replyingTo, setReplyingTo]: [string, extendedTypes.Setter<string>] = useState("");

    const messages = mockData.messages(16);

    const messageList = (
        <div className={styles["message-list-container"]} key={0}>
            <LayoutUI.List
                label="navigation"
                ordered={false}
                listItems={messages.map((message, i) => message)}
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

    const replyingToElement = replyingTo.length > 0 ? (
        <div className={styles["replying-to-container"]} key={0}>
            <Buttons.Basic
                text=""
                symbol="cancel"
                onClickHandler={() => setReplyingTo("")}
                otherStyles={{ fontSize: "1.2rem", padding: "0.5rem" }}
            />
            <p className={`truncate-ellipsis ${styles["replying-to-string"]}`} key={0}>
                {`Replying to ${replyingTo}`}
            </p>
        </div>
    ) : null;

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
                            { size: "auto", children: [replyingToElement] },
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

export default Active;
