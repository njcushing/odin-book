import { useState } from "react";
import Buttons from "@/components/buttons";
import * as ButtonTypes from "@/components/buttons/types";
import * as ModelTypes from "@/utils/modelTypes";
import User from "../..";
import styles from "./index.module.css";

type UserTypesPicked = Pick<ModelTypes.User, "_id" | "accountTag"> & {
    preferences: Pick<ModelTypes.User["preferences"], "displayName">;
};

type Users = {
    [key: string]: UserTypesPicked;
};

function Selector() {
    const [selectedUsers, setSelectedUsers] = useState<Users>({});

    const addButton: ButtonTypes.Basic = {
        text: "",
        symbol: "add",
        palette: "green",
        otherStyles: { fontSize: "1.2rem", padding: "0.2rem" },
    };

    return (
        <div className={styles["container"]}>
            <User.Finder
                placeholder="Search for users..."
                button={addButton}
                onClickHandler={(user) => {
                    const newSelectedUsers: Users = {};
                    const key = user._id;
                    newSelectedUsers[key] = {
                        _id: user._id,
                        accountTag: user.accountTag,
                        preferences: {
                            displayName: user.preferences.displayName,
                        },
                    };
                    setSelectedUsers({ ...selectedUsers, ...newSelectedUsers });
                }}
                clearFindOnClick
            />
            {Object.keys(selectedUsers).length > 0 && (
                <ul className={styles["selected-users"]}>
                    {Object.keys(selectedUsers).map((key) => {
                        const user = selectedUsers[key];
                        return (
                            <li className={styles["user"]} key={user._id}>
                                <div className={styles["user-info"]}>
                                    <p className={styles["display-name"]}>
                                        {user.preferences.displayName}
                                    </p>
                                    <p className={styles["account-tag"]}>@{user.accountTag}</p>
                                </div>
                                <Buttons.Basic
                                    text=""
                                    symbol="remove"
                                    onClickHandler={() => {
                                        const newSelectedUsers = { ...selectedUsers };
                                        delete newSelectedUsers[key];
                                        setSelectedUsers(newSelectedUsers);
                                    }}
                                    palette="red"
                                    otherStyles={{ fontSize: "1.0rem", padding: "0.2rem" }}
                                />
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default Selector;
