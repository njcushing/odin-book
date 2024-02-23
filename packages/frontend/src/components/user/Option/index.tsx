import Buttons from "@/components/buttons";
import User from "..";
import * as Types from "../types";
import styles from "./index.module.css";

function Option({ user, following }: Types.Option) {
    return (
        <div className={styles["container"]}>
            <User.ImageAndName
                image={{ src: user.image.src, alt: user.image.alt }}
                displayName={user.displayName}
                accountTag={user.accountTag}
                size="s"
            />
            {following ? (
                <Buttons.Basic
                    text="Unfollow"
                    symbol="person_remove"
                    palette="red"
                    otherStyles={{ fontSize: "1.0rem" }}
                />
            ) : (
                <Buttons.Basic
                    text="Follow"
                    symbol="person_add"
                    palette="orange"
                    otherStyles={{ fontSize: "1.0rem" }}
                />
            )}
        </div>
    );
}

export default Option;
