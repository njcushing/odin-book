import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as useAsync from "@/hooks/useAsync";
import { UserContext } from "@/context/user";
import { ProfileContext } from "@/features/profile/Main";
import Images from "@/components/images";
import Buttons from "@/components/buttons";
import Accessibility from "@/components/accessibility";
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

    const navigate = useNavigate();

    const [waiting, setWaiting] = useState(true);

    // get user summary api handling
    const [userSummary, setUserSummary] = useState<GetUserSummaryResponse>(null);
    const [
        getUserSummaryResponse,
        setGetUserSummaryParams,
        getUserSummaryAgain,
        gettingUserSummary,
    ] = useAsync.GET<GetUserSummaryParams, GetUserSummaryResponse>(
        {
            func: getUserSummary,
            parameters: [{ params: { userId: _id } }, null],
        },
        true,
    );
    useEffect(() => {
        const newState = getUserSummaryResponse ? getUserSummaryResponse.data : null;
        setUserSummary(newState);
    }, [getUserSummaryResponse]);

    if (getUserSummaryResponse && getUserSummaryResponse.status === 401) {
        window.location.assign("/");
    }

    // follow user api handling
    const [followUserResponse, setFollowUserParams, followUserAgain, followingUser] = useAsync.PUT<
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
    }, [getUserSummaryAgain]);

    useEffect(() => {
        if (followUserResponse && followUserResponse.status < 400) {
            setUserSummary((prevUserSummary) => {
                if (prevUserSummary) {
                    return {
                        ...prevUserSummary,
                        followersCount: prevUserSummary.isFollowing
                            ? prevUserSummary.followersCount - 1
                            : prevUserSummary.followersCount + 1,
                        isFollowing: !prevUserSummary.isFollowing,
                    };
                }
                getUserSummaryAgain(true);
                return prevUserSummary;
            });
        }
    }, [followUserResponse, getUserSummaryAgain]);

    useEffect(() => {
        setWaiting(gettingUserSummary);
    }, [gettingUserSummary]);

    let displayNameString = "userino";
    if (userSummary) {
        if (userSummary.preferences.displayName.length > 0) {
            displayNameString = userSummary.preferences.displayName;
        } else {
            displayNameString = userSummary.accountTag;
        }
    }

    let button = <Buttons.Basic text="Edit Profile" />;
    if (userSummary) {
        if (extract("accountTag") === userSummary.accountTag) {
            button = (
                <Buttons.Basic
                    text="Edit Profile"
                    onClickHandler={() => {
                        navigate("/settings/profile");
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
                    disabled={followingUser}
                    onClickHandler={() => followUserAgain(true)}
                    otherStyles={{ fontSize: "1.0rem" }}
                />
            );
        }
    }

    // including ' || userSummary === null' allows skeletons to display when provided userId is bad
    const currentlyWaiting = waiting || userSummary === null;

    return (
        <div className={styles["container"]}>
            <div className={styles["banner-image"]}>
                <Accessibility.Skeleton waiting={currentlyWaiting} style={{ width: "100%" }}>
                    <Images.Basic
                        src={new Uint8Array([])}
                        alt=""
                        style={{ width: "100%", height: "240px" }}
                    />
                </Accessibility.Skeleton>
            </div>
            <div className={styles["main-content-container"]}>
                <div className={styles["row-one"]}>
                    <div className={styles["row-one-left"]}>
                        <Accessibility.Skeleton
                            waiting={currentlyWaiting}
                            style={{ borderRadius: "9999px" }}
                        >
                            {userSummary && userSummary.preferences.profileImage ? (
                                <Images.Profile
                                    src={userSummary.preferences.profileImage.url}
                                    alt={userSummary.preferences.profileImage.alt}
                                    sizePx={120}
                                />
                            ) : (
                                <Images.Profile sizePx={120} />
                            )}
                        </Accessibility.Skeleton>
                    </div>
                    <div className={styles["row-one-right"]}>
                        <Accessibility.Skeleton
                            waiting={currentlyWaiting}
                            style={{ width: "100%" }}
                        >
                            <h2 className={`truncate-ellipsis ${styles["display-name"]}`}>
                                {displayNameString}
                            </h2>
                        </Accessibility.Skeleton>
                        <Accessibility.Skeleton
                            waiting={currentlyWaiting}
                            style={{ width: "100%" }}
                        >
                            <h3 className={`truncate-ellipsis ${styles["account-tag"]}`}>
                                @{userSummary ? userSummary.accountTag : "user"}
                            </h3>
                        </Accessibility.Skeleton>
                        <Accessibility.Skeleton
                            waiting={currentlyWaiting}
                            style={{ borderRadius: "9999px" }}
                        >
                            {button}
                        </Accessibility.Skeleton>
                    </div>
                </div>
                <Accessibility.Skeleton waiting={currentlyWaiting} style={{ width: "100%" }}>
                    <div className={styles["row-two"]}>
                        <p className={styles["bio"]}>
                            {userSummary ? userSummary.preferences.bio : "placeholder"}
                        </p>
                    </div>
                </Accessibility.Skeleton>
                <div className={styles["row-three"]}>
                    <Accessibility.Skeleton waiting={currentlyWaiting}>
                        <p className={styles["account-creation-date"]}>
                            {formatCreationDate(
                                userSummary
                                    ? userSummary.creationDate
                                    : "Account creation date unknown",
                            )}
                        </p>
                    </Accessibility.Skeleton>
                </div>
                <div className={styles["row-four"]}>
                    <Accessibility.Skeleton waiting={currentlyWaiting}>
                        <p className={styles["following-count"]}>
                            <strong>{userSummary ? userSummary.followingCount : "0"}</strong>{" "}
                            Following
                        </p>
                    </Accessibility.Skeleton>
                    <Accessibility.Skeleton waiting={currentlyWaiting}>
                        <p className={styles["followers-count"]}>
                            <strong>{userSummary ? userSummary.followersCount : "0"}</strong>{" "}
                            Followers
                        </p>
                    </Accessibility.Skeleton>
                    <Accessibility.Skeleton waiting={currentlyWaiting}>
                        <p className={styles["likes-count"]}>
                            <strong>{userSummary ? userSummary.likesCount : "0"}</strong> Likes
                        </p>
                    </Accessibility.Skeleton>
                </div>
            </div>
            {errorMessage.length > 0 ? (
                <p className={styles["error-message"]}>{errorMessage}</p>
            ) : null}
        </div>
    );
}

export default Summary;
