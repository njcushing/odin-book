import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/context/user";
import createMultilineTextTruncateStyles from "@/utils/createMultilineTextTruncateStyles";
import Images from "@/components/images";
import User from "@/components/user";
import Accessibility from "@/components/accessibility";
import formatCreationDate from "@/utils/formatCreationDate";
import styles from "./index.module.css";

type SidebarTypes = {
    type: "wide" | "thin";
};

function Sidebar({ type }: SidebarTypes) {
    const { awaitingResponse, extract } = useContext(UserContext);

    const [waiting, setWaiting] = useState<boolean>(awaitingResponse);

    useEffect(() => {
        setWaiting(awaitingResponse);
    }, [awaitingResponse]);

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
                    waiting={waiting}
                    image={
                        extract("preferences.profileImage")
                            ? {
                                  src: (extract("preferences.profileImage") as { url: string }).url,
                                  alt: (extract("preferences.profileImage") as { alt: string }).alt,
                              }
                            : { src: "", alt: "" }
                    }
                    displayName={`${extract("preferences.displayName")}`}
                    accountTag={`${extract("accountTag")}`}
                    size="m"
                />
            </div>
            {waiting || `${extract("preferences.bio")}`.length > 0 ? (
                <Accessibility.Skeleton waiting={waiting} style={{ width: "100%" }}>
                    <div className={styles["row-two"]}>
                        <p
                            className={styles["bio"]}
                            style={{ ...createMultilineTextTruncateStyles(4) }}
                        >
                            {!waiting ? `${extract("preferences.bio")}` : "placeholder"}
                        </p>
                    </div>
                </Accessibility.Skeleton>
            ) : null}
            <div className={styles["row-three"]}>
                <Accessibility.Skeleton waiting={waiting}>
                    <p className={styles["following-count"]}>
                        <strong>{`${extract("followingCount")}`}</strong> Following
                    </p>
                </Accessibility.Skeleton>
                <Accessibility.Skeleton waiting={waiting}>
                    <p className={styles["followers-count"]}>
                        <strong>{`${extract("followersCount")}`}</strong> Followers
                    </p>
                </Accessibility.Skeleton>
                <Accessibility.Skeleton waiting={waiting}>
                    <p className={styles["likes-count"]}>
                        <strong>{`${extract("likesCount")}`}</strong> Likes
                    </p>
                </Accessibility.Skeleton>
            </div>
            <div className={styles["row-four"]}>
                <Accessibility.Skeleton waiting={waiting}>
                    <p className={styles["account-creation-date"]}>
                        {!waiting
                            ? formatCreationDate(`${extract("creationDate")}`)
                            : "Account creation date unknown"}
                    </p>
                </Accessibility.Skeleton>
            </div>
        </div>
    );
}

export default Sidebar;
