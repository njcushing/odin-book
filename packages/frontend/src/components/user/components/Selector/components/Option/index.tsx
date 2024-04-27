import * as ModelTypes from "@/utils/modelTypes";
import Buttons from "@/components/buttons";
import styles from "./index.module.css";

export type OptionTypes = {
    user: Pick<ModelTypes.User, "accountTag"> & {
        preferences: Pick<ModelTypes.User["preferences"], "displayName">;
    };
    onClickHandler?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | null;
    disabled?: boolean;
};

function Option({ user, onClickHandler = null, disabled = false }: OptionTypes) {
    const { accountTag, preferences } = user;

    return (
        <li className={styles["user"]}>
            <div className={styles["user-info"]}>
                <p className={styles["display-name"]}>{preferences.displayName}</p>
                <p className={styles["account-tag"]}>@{accountTag}</p>
            </div>
            <Buttons.Basic
                text=""
                symbol="remove"
                onClickHandler={(e) => {
                    if (onClickHandler) onClickHandler(e);
                }}
                disabled={disabled}
                palette="red"
                otherStyles={{ fontSize: "1.0rem", padding: "0.2rem" }}
            />
        </li>
    );
}

export default Option;
