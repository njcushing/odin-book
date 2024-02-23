import Buttons from "@/components/buttons";
import User from "..";
import * as Types from "../types";
import styles from "./index.module.css";

function Option({ user, following, onClickHandler = null }: Types.Option) {
    return (
        <div className={styles["container"]}>
            <User.ImageAndName
                image={{ src: user.image.src, alt: user.image.alt }}
                displayName={user.displayName}
                accountTag={user.accountTag}
                size="s"
            />
            <Buttons.Basic
                text={following ? "Unfollow" : "Follow"}
                symbol={following ? "person_remove" : "person_add"}
                palette={following ? "red" : "orange"}
                onClickHandler={onClickHandler}
                otherStyles={{ fontSize: "1.0rem" }}
            />
        </div>
    );
}

export default Option;
