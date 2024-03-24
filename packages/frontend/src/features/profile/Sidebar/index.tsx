import { useContext } from "react";
import { UserContext } from "@/context/user";
import createMultilineTextTruncateStyles from "@/utils/createMultilineTextTruncateStyles";
import Images from "@/components/images";
import User from "@/components/user";
import styles from "./index.module.css";

type SidebarTypes = {
    type: "wide" | "thin";
};

function Sidebar({ type }: SidebarTypes) {
    const { extract } = useContext(UserContext);

    if (type === "thin") {
        return (
            <div className={styles["container"]}>
                <Images.Profile src={new Uint8Array([])} sizePx={48} />
            </div>
        );
    }
    return (
        <div className={styles["container"]}>
            <div className={styles["row-one"]}>
                <User.ImageAndName
                    image={{ src: new Uint8Array([]), alt: "" }}
                    displayName={`${extract("preferences.displayName")}`}
                    accountTag={`${extract("accountTag")}`}
                    size="m"
                />
            </div>
            <div className={styles["row-two"]}>
                <p className={styles["bio"]} style={{ ...createMultilineTextTruncateStyles(4) }}>
                    {extract("preferences.bio") as string}
                </p>
            </div>
            <div className={styles["row-three"]}>
                <p className={styles["following-count"]}>
                    <strong>{`${extract("followingCount")}`}</strong> Following
                </p>
                <p className={styles["followers-count"]}>
                    <strong>{`${extract("followersCount")}`}</strong> Followers
                </p>
                <p className={styles["likes-count"]}>
                    <strong>{`${extract("likesCount")}`}</strong> Likes
                </p>
            </div>
            <div className={styles["row-four"]}>
                <p className={styles["account-creation-date"]}>Joined February 2024</p>
            </div>
        </div>
    );
}

export default Sidebar;
