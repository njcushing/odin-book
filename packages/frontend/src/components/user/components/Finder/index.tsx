import { useState } from "react";
import Inputs from "@/components/inputs";
import Buttons from "@/components/buttons";
import * as ButtonTypes from "@/components/buttons/types";
import * as Types from "../../types";
import User from "../..";
import styles from "./index.module.css";

type FinderTypes = {
    placeholder?: string;
    button?: ButtonTypes.Basic;
};

function Finder({ placeholder, button }: FinderTypes) {
    const [user, setUser] = useState<Types.ImageAndName | null>(null);

    return (
        <div className={styles["container"]}>
            <Inputs.Search
                onSearchHandler={() => {
                    /* find user */
                }}
                placeholder={placeholder}
            />
            {user && (
                <div className={styles["found-user"]}>
                    <User.ImageAndName
                        image={{ src: user.image.src, alt: user.image.alt }}
                        displayName={user.displayName}
                        accountTag={user.accountTag}
                        size="m"
                    />
                    {button && <Buttons.Basic {...button} />}
                </div>
            )}
        </div>
    );
}

export default Finder;
