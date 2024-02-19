import LayoutUI from "@/layouts";
import Inputs from "@/components/inputs";
import Buttons from "@/components/buttons";
import Chat from "..";
import styles from "./index.module.css";

function Panel() {
    const messages = [true, false, false, true, false, false, true, true];

    const buttonStyles = { fontSize: "1.1rem", padding: "0.6rem" };

    return (
        <div className={styles["container"]}>
            <div className={styles["header"]}>
                <div className={styles["name-container"]}>
                    <h3 className={`truncate-ellipsis ${styles["name"]}`}>Chat Title</h3>
                    <Buttons.Basic
                        text=""
                        symbol="edit"
                        label="edit chat name"
                        palette="orange"
                        otherStyles={{ ...buttonStyles }}
                    />
                </div>
                <div className={styles["options"]}>
                    <Buttons.Basic
                        text=""
                        symbol="person_add"
                        label="add people"
                        palette="blue"
                        otherStyles={{ ...buttonStyles }}
                    />
                    <Buttons.Basic
                        text=""
                        symbol="call"
                        label="call"
                        palette="blue"
                        otherStyles={{ ...buttonStyles }}
                    />
                    <Buttons.Basic
                        text=""
                        symbol="videocam"
                        label="call with video"
                        palette="blue"
                        otherStyles={{ ...buttonStyles }}
                    />
                </div>
            </div>
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
            <Inputs.Message placeholder="Type your message..." />
        </div>
    );
}

export default Panel;
