import { useState } from "react";
import Buttons from "@/components/buttons";
import { BasicTypes as ButtonBasicTypes } from "@/components/buttons/components/Basic";
import * as ModelTypes from "@/utils/modelTypes";
import User from "../..";
import styles from "./index.module.css";
import Option from "./components/Option";

type UserTypesPicked = Pick<ModelTypes.User, "_id" | "accountTag"> & {
    preferences: Pick<ModelTypes.User["preferences"], "displayName">;
};

type Users = {
    [key: string]: UserTypesPicked;
};

export type SelectorTypes = {
    onChangeHandler?: ((selectedUsers: Users) => void) | null;
};

function Selector({ onChangeHandler }: SelectorTypes) {
    const [selectedUsers, setSelectedUsers] = useState<Users>({});

    const addButton: ButtonBasicTypes = {
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
                    if (onChangeHandler) onChangeHandler({ ...selectedUsers, ...newSelectedUsers });
                }}
                clearFindOnClick
            />
            {Object.keys(selectedUsers).length > 0 && (
                <ul className={styles["selected-users"]}>
                    {Object.keys(selectedUsers).map((key) => {
                        const user = selectedUsers[key];
                        return (
                            <Option
                                user={{
                                    accountTag: user.accountTag,
                                    preferences: {
                                        displayName: user.preferences.displayName,
                                    },
                                }}
                                onClickHandler={() => {
                                    const newSelectedUsers = { ...selectedUsers };
                                    delete newSelectedUsers[key];
                                    setSelectedUsers(newSelectedUsers);
                                    if (onChangeHandler) onChangeHandler(newSelectedUsers);
                                }}
                                key={user._id}
                            />
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default Selector;
