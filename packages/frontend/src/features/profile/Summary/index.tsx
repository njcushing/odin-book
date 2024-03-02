import Images from "@/components/images";
import Buttons from "@/components/buttons";
import styles from "./index.module.css";

function Summary() {
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
                            John Smith
                        </h2>
                        <h3 className={`truncate-ellipsis ${styles["account-tag"]}`}>
                            @JohnSmith84
                        </h3>
                        <Buttons.Basic
                            text="Edit Profile"
                            onClickHandler={() => {
                                window.location.href = "/settings/profile";
                            }}
                            palette="blue"
                        />
                    </div>
                </div>
                <div className={styles["row-two"]}>
                    <p className={styles["bio"]}>
                        Sample Text Sample Text Sample Text Sample Text Sample Text Sample Text
                        Sample Text Sample Text Sample Text
                    </p>
                </div>
                <div className={styles["row-three"]}>
                    <p className={styles["account-creation-date"]}>Joined February 2024</p>
                </div>
                <div className={styles["row-four"]}>
                    <p className={styles["following-count"]}>
                        <strong>300</strong> Following
                    </p>
                    <p className={styles["followers-count"]}>
                        <strong>192</strong> Followers
                    </p>
                    <p className={styles["likes-count"]}>
                        <strong>3892</strong> Likes
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Summary;
