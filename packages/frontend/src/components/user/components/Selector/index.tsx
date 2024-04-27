import { useState } from "react";
import { BasicTypes as ButtonBasicTypes } from "@/components/buttons/components/Basic";
import { Response } from "@/components/user/components/Finder/utils/getUserOverviewFromTag";
import User from "../..";
import styles from "./index.module.css";
import Option from "./components/Option";

type Users = {
    [key: string]: Exclude<Response, null>;
};

export type SelectorTypes = {
    onChangeHandler?: ((selectedUsers: Users) => void) | null;
    disabled?: boolean;
};

function Selector({ onChangeHandler, disabled = false }: SelectorTypes) {
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
                    const key = `${user._id}`;
                    newSelectedUsers[key] = user;
                    setSelectedUsers({ ...selectedUsers, ...newSelectedUsers });
                    if (onChangeHandler) onChangeHandler({ ...selectedUsers, ...newSelectedUsers });
                }}
                disabled={disabled}
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
                                disabled={disabled}
                                key={key}
                            />
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default Selector;
