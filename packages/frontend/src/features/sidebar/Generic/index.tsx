import Profile from "@/features/profile";
import Navigation from "@/features/navigation";
import styles from "./index.module.css";

type GenericTypes = {
    type: "wide" | "thin";
};

function Generic({ type }: GenericTypes) {
    if (type === "wide") {
        return (
            <div className={styles["container"]}>
                <Profile.Summary type="wide" />
                <Navigation.Menu type="wide" />
            </div>
        );
    }

    if (type === "thin") {
        return (
            <div className={styles["container"]}>
                <Profile.Summary type="thin" />
                <Navigation.Menu type="thin" />
            </div>
        );
    }
}

export default Generic;
