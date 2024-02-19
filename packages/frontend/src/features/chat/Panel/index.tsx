import LayoutUI from "@/layouts";
import Inputs from "@/components/inputs";
import Buttons from "@/components/buttons";
import Chat from "..";
import styles from "./index.module.css";

function Panel() {
    const messages = [true, false, false, true, false, false, true, true];

    return (
        <div className={styles["container"]}>
            <Chat.Header />
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
