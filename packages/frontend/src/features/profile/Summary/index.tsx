import { useState, useEffect, useContext } from "react";
import * as useAsync from "@/hooks/useAsync";
import { UserContext } from "@/context/user";
import { ProfileContext } from "@/features/profile/Main";
import Images from "@/components/images";
import Buttons from "@/components/buttons";
import formatCreationDate from "@/utils/formatCreationDate";
import followUser, {
    Params as FollowUserParams,
} from "@/components/user/components/Option/utils/followUser";
import getUserSummary, {
    Params as GetUserSummaryParams,
    Response as GetUserSummaryResponse,
} from "./utils/getUserSummary";
import styles from "./index.module.css";

function Summary() {
    const { extract } = useContext(UserContext);
    const { _id } = useContext(ProfileContext);

    // get option api handling
    const [userSummary, setUserSummary] = useState<GetUserSummaryResponse>(null);
    const [getUserSummaryResponse, setGetUserSummaryParams, getUserSummaryAgain] = useAsync.GET<
        GetUserSummaryParams,
        GetUserSummaryResponse
    >({
        func: getUserSummary,
        parameters: [{ params: { userId: _id } }, null],
    });
    useEffect(() => {
        const newState = getUserSummaryResponse ? getUserSummaryResponse.data : null;
        setUserSummary(newState);
    }, [getUserSummaryResponse]);

    if (getUserSummaryResponse && getUserSummaryResponse.status === 401) {
        window.location.assign("/");
    }

    // follow user api handling
    const [followUserResponse, setFollowUserParams, followUserAgain] = useAsync.PUT<
        FollowUserParams,
        null,
        null
    >(
        {
            func: followUser,
            parameters: [{ params: { userId: _id } }, null],
        },
        false,
    );

    // error message handling
    const [errorMessage, setErrorMessage] = useState<string>("");
    useEffect(() => {
        if (
            getUserSummaryResponse &&
            getUserSummaryResponse.status >= 400 &&
            getUserSummaryResponse.message &&
            getUserSummaryResponse.message.length > 0
        ) {
            setErrorMessage(getUserSummaryResponse.message);
        }
    }, [getUserSummaryResponse]);

    useEffect(() => {
        getUserSummaryAgain(true);
        setErrorMessage("");
        setGetUserSummaryParams([{ params: { userId: _id } }, null]);
        setFollowUserParams([{ params: { userId: _id } }, null]);
    }, [_id, setGetUserSummaryParams, getUserSummaryAgain, setFollowUserParams]);

    useEffect(() => {
        getUserSummaryAgain(true);
        setErrorMessage("");
    }, [getUserSummaryAgain, followUserResponse]);

    let displayNameString = "user";
    if (userSummary) {
        if (userSummary.preferences.displayName.length > 0) {
            displayNameString = userSummary.preferences.displayName;
        } else {
            displayNameString = userSummary.accountTag;
        }
    }

    let button = null;
    if (userSummary) {
        if (extract("accountTag") === userSummary.accountTag) {
            button = (
                <Buttons.Basic
                    text="Edit Profile"
                    onClickHandler={() => {
                        window.location.href = "/settings/profile";
                    }}
                    palette="blue"
                />
            );
        } else {
            button = (
                <Buttons.Basic
                    text={userSummary.isFollowing ? "Unfollow" : "Follow"}
                    symbol={userSummary.isFollowing ? "person_remove" : "person_add"}
                    palette={userSummary.isFollowing ? "red" : "orange"}
                    onClickHandler={() => followUserAgain(true)}
                    otherStyles={{ fontSize: "1.0rem" }}
                />
            );
        }
    }

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
                        {userSummary && userSummary.preferences.profileImage ? (
                            <Images.Profile
                                src={userSummary.preferences.profileImage.url}
                                alt=""
                                sizePx={120}
                            />
                        ) : (
                            <Images.Profile sizePx={120} />
                        )}
                    </div>
                    <div className={styles["row-one-right"]}>
                        <h2 className={`truncate-ellipsis ${styles["display-name"]}`}>
                            {displayNameString}
                        </h2>
                        <h3 className={`truncate-ellipsis ${styles["account-tag"]}`}>
                            @{userSummary ? userSummary.accountTag : "user"}
                        </h3>
                        {button}
                    </div>
                </div>
                {userSummary && userSummary.preferences.bio.length > 0 ? (
                    <div className={styles["row-two"]}>
                        <p className={styles["bio"]}>{userSummary.preferences.bio}</p>
                    </div>
                ) : null}
                <div className={styles["row-three"]}>
                    <p className={styles["account-creation-date"]}>
                        {formatCreationDate(userSummary ? userSummary.creationDate : "0")}
                    </p>
                </div>
                <div className={styles["row-four"]}>
                    <p className={styles["following-count"]}>
                        <strong>{userSummary ? userSummary.followingCount : "0"}</strong> Following
                    </p>
                    <p className={styles["followers-count"]}>
                        <strong>{userSummary ? userSummary.followersCount : "0"}</strong> Followers
                    </p>
                    <p className={styles["likes-count"]}>
                        <strong>{userSummary ? userSummary.likesCount : "0"}</strong> Likes
                    </p>
                </div>
            </div>
            {errorMessage.length > 0 ? (
                <p className={styles["error-message"]}>{errorMessage}</p>
            ) : null}
        </div>
    );
}

export default Summary;
