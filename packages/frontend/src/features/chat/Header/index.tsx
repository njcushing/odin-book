import React, { useState, useEffect } from "react";
import * as extendedTypes from "@/utils/extendedTypes";
import Buttons from "@/components/buttons";
import styles from "./index.module.css";

const buttonStyles = { fontSize: "1.1rem", padding: "0.6rem" };

type HeaderTypes = {
    name?: string;
    onEditNameHandler?: ((name: string) => void) | null;
};

function Header({ name = "Chat Title", onEditNameHandler = null }: HeaderTypes) {
    const [editingName, setEditingName]: [boolean, extendedTypes.Setter<boolean>] = useState(false);
    const [chatName, setChatName]: [string, extendedTypes.Setter<string>] = useState(name);
    const [nameStored, setNameStored]: [string, extendedTypes.Setter<string>] = useState(name);

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
                        autoFocus
                    ></input>
                )}
                <Buttons.Basic
                    text=""
                    symbol="edit"
                    label="edit chat name"
                    otherStyles={{ ...buttonStyles }}
                    onClickHandler={() => {
                        setEditingName(!editingName);
                    }}
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
    );
}

export default Header;
