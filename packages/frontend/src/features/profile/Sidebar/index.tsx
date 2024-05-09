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
    const { setUser, awaitingResponse, extract } = useContext(UserContext);

    const [waiting, setWaiting] = useState<boolean>(awaitingResponse);

    useEffect(() => {
        setWaiting(awaitingResponse);
    }, [awaitingResponse]);

    useEffect(() => {
        PubSub.unsubscribe("successful-settings-update-user-preferences-profileImage");
        PubSub.unsubscribe("successful-settings-update-user-preferences-displayName");
        PubSub.unsubscribe("successful-settings-update-user-preferences-bio");

        PubSub.subscribe(
            "successful-settings-update-user-preferences-profileImage",
            (msg, data) => {
                setUser((oldUser) => ({
                    ...oldUser,
                    preferences: { ...oldUser.preferences, profileImage: data.profileImage },
                }));
            },
        );

        PubSub.subscribe("successful-settings-update-user-preferences-displayName", (msg, data) => {
            setUser((oldUser) => ({
                ...oldUser,
                preferences: { ...oldUser.preferences, displayName: data.displayName },
            }));
        });

        PubSub.subscribe("successful-settings-update-user-preferences-bio", (msg, data) => {
            setUser((oldUser) => ({
                ...oldUser,
                preferences: { ...oldUser.preferences, bio: data.bio },
            }));
        });

        return () => {
            PubSub.unsubscribe("successful-settings-update-user-preferences-profileImage");
            PubSub.unsubscribe("successful-settings-update-user-preferences-displayName");
            PubSub.unsubscribe("successful-settings-update-user-preferences-bio");
        };
    }, [setUser]);

    if (type === "thin") {
        return (
            <div className={styles["container"]}>
                {extract("preferences.profileImage") ? (
                    <Images.Profile
                        src={(extract("preferences.profileImage") as { url: string }).url}
                        alt={(extract("preferences.profileImage") as { alt: string }).alt}
                        sizePx={40}
                    />
                ) : (
                    <Images.Profile sizePx={40} />
                )}
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
