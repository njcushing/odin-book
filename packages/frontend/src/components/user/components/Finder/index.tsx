import { useState } from "react";
import Inputs from "@/components/inputs";
import Buttons from "@/components/buttons";
import { BasicTypes as ButtonBasicTypes } from "@/components/buttons/components/Basic";
import findUser, { User as UserTypes } from "./utils/findUserFromTag";
import User from "../..";
import styles from "./index.module.css";

export type FinderTypes = {
    placeholder?: string;
    button?: ButtonBasicTypes;
    clearFindOnClick?: boolean;
    onClickHandler?: ((user: UserTypes) => void) | null;
};

function Finder({ placeholder, button, onClickHandler, clearFindOnClick }: FinderTypes) {
    const [user, setUser] = useState<UserTypes | null>(null);

    return (
        <div className={styles["container"]}>
            <Inputs.Search
                onSearchHandler={() => {
                    const userNew = findUser("");
                    setUser(userNew);
                }}
                placeholder={placeholder}
            />
            {user && (
                <div className={styles["found-user"]}>
                    <User.ImageAndName
                        image={{
                            src: user.preferences.profileImage.src,
                            alt: user.preferences.profileImage.alt,
                        }}
                        displayName={user.preferences.displayName}
                        accountTag={user.accountTag}
                        size="m"
                    />
                    {button && (
                        <Buttons.Basic
                            {...button}
                            onClickHandler={() => {
                                if (onClickHandler) onClickHandler(user);
                                if (clearFindOnClick) setUser(null);
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default Finder;
