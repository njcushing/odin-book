import React, { useContext, useState, useEffect } from "react";
import { ChatContext } from "@/features/chat/Active";
import Buttons from "@/components/buttons";
import determineChatName from "@/features/chat/utils/determineChatName";
import styles from "./index.module.css";

const buttonStyles = { fontSize: "1.1rem", padding: "0.6rem" };

type HeaderTypes = {
    overrideChatName?: string;
    onEditNameHandler?: ((name: string) => void) | null;
};

function Header({ overrideChatName, onEditNameHandler = null }: HeaderTypes) {
    const { chatData } = useContext(ChatContext);

    const [editingName, setEditingName] = useState<boolean>(false);
    const [chatName, setChatName] = useState<string>(
        overrideChatName || determineChatName(chatData),
    );
    const [nameStored, setNameStored] = useState<string>(
        overrideChatName || determineChatName(chatData),
    );

    useEffect(() => {
        if (!editingName && onEditNameHandler && chatName !== nameStored) {
            onEditNameHandler(chatName);
            setNameStored(chatName);
        }
    }, [editingName, chatName, onEditNameHandler, nameStored]);

    return (
        <div className={styles["header"]}>
            <div className={styles["name-container"]}>
                {!editingName ? (
                    <h3 className={`truncate-ellipsis ${styles["name"]}`}>{chatName}</h3>
                ) : (
                    <input
                        className={styles["edit-name"]}
                        type="text"
                        defaultValue={chatName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setChatName(e.target.value)
                        }
                        onBlur={() => setEditingName(false)}
                        // eslint-disable-next-line jsx-a11y/no-autofocus
                        autoFocus
                    ></input>
                )}
                <Buttons.Basic
                    text=""
                    symbol={!editingName ? "edit" : "done"}
                    label="edit chat name"
                    onClickHandler={() => {
                        setEditingName(!editingName);
                    }}
                    palette={!editingName ? "primary" : "green"}
                    otherStyles={{ ...buttonStyles }}
                />
            </div>
            <div className={styles["options"]}>
                <Buttons.Basic
                    text=""
                    symbol="person_add"
                    label="add people"
                    onClickHandler={() => {
                        PubSub.publish("add-users-to-chat-button-click", null);
                    }}
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
    );
}

export default Header;
