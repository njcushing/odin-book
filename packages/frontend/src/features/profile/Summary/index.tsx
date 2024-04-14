import { useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "@/context/user";
import { ProfileContext } from "@/features/profile/Main";
import Images from "@/components/images";
import Buttons from "@/components/buttons";
import formatCreationDate from "@/utils/formatCreationDate";
import styles from "./index.module.css";

function Summary() {
    const { extract } = useContext(UserContext);

    const { accountTag } = useParams();

    return (
        <div className={styles["container"]}>
            <div className={styles["banner-image"]}>
                <Images.Basic
                    src={new Uint8Array([])}
                    alt=""
                    style={{ width: "100%", height: "200px" }}
                />
            </div>
            <div className={styles["main-content-container"]}>
                <div className={styles["row-one"]}>
                    <div className={styles["row-one-left"]}>
                        <Images.Profile src={new Uint8Array([])} alt="" sizePx={120} />
                    </div>
                    <div className={styles["row-one-right"]}>
                        <h2 className={`truncate-ellipsis ${styles["display-name"]}`}>
                            {`${extract("preferences.displayName")}`.length > 0
                                ? `${extract("preferences.displayName")}`
                                : `${extract("accountTag")}`}
                        </h2>
                        <h3 className={`truncate-ellipsis ${styles["account-tag"]}`}>
                            @{`${extract("accountTag")}`}
                        </h3>
                        {extract("accountTag") === accountTag ? (
                            <Buttons.Basic
                                text="Edit Profile"
                                onClickHandler={() => {
                                    window.location.href = "/settings/profile";
                                }}
                                palette="blue"
                            />
                        ) : null}
                    </div>
                </div>
                {`${extract("preferences.bio")}`.length > 0 ? (
                    <div className={styles["row-two"]}>
                        <p className={styles["bio"]}>{`${extract("preferences.bio")}`}</p>
                    </div>
                ) : null}
                <div className={styles["row-three"]}>
                    <p className={styles["account-creation-date"]}>
                        {formatCreationDate(`${extract("creationDate")}`)}
                    </p>
                </div>
                <div className={styles["row-four"]}>
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
            </div>
        </div>
    );
}

export default Summary;
