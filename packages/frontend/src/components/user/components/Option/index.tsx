import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/context/user";
import * as useAsync from "@/hooks/useAsync";
import Buttons from "@/components/buttons";
import Accessibility from "@/components/accessibility";
import mongoose from "mongoose";
import User from "../..";
import styles from "./index.module.css";
import getOption, {
    Params as GetOptionParams,
    Response as GetOptionResponse,
} from "./utils/getOption";
import followUser, { Params as FollowUserParams } from "./utils/followUser";

export type OptionTypes = {
    _id: mongoose.Types.ObjectId | undefined | null;
    overrideOptionData?: GetOptionResponse;
    skeleton?: boolean;
};

function Option({ _id, overrideOptionData, skeleton = false }: OptionTypes) {
    const { user, extract } = useContext(UserContext);

    const [waiting, setWaiting] = useState<boolean>(true);
    const [displayFollowButton, setDisplayFollowButton] = useState<boolean>(true);

    useEffect(() => {
        setDisplayFollowButton(extract("_id") !== _id);
    }, [user, _id, extract]);

    // get option api handling
    const [optionData, setOptionData] = useState<GetOptionResponse>(null);
    const [getOptionResponse /* setGetOptionParams */, , getOptionAgain, gettingOption] =
        useAsync.GET<GetOptionParams, GetOptionResponse>(
            {
                func: getOption,
                parameters: [{ params: { userId: _id } }, null],
            },
            !overrideOptionData,
        );
    useEffect(() => {
        if (!overrideOptionData) {
            const newState = getOptionResponse ? getOptionResponse.data : null;
            setOptionData(newState);
        }
    }, [overrideOptionData, getOptionResponse]);

    // follow user api handling
    const [followUserResponse /* setFollowUserParams */, , followUserAgain, followingUser] =
        useAsync.PUT<FollowUserParams, null, null>(
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
            getOptionResponse &&
            getOptionResponse.status >= 400 &&
            getOptionResponse.message &&
            getOptionResponse.message.length > 0
        ) {
            setErrorMessage(getOptionResponse.message);
        }
    }, [getOptionResponse]);

    // fetch option again
    useEffect(() => {
        if (overrideOptionData) {
            setOptionData(overrideOptionData);
        } else {
            getOptionAgain(true);
        }
    }, [overrideOptionData, getOptionAgain]);

    useEffect(() => {
        if (followUserResponse && followUserResponse.status < 400) {
            setOptionData((prevOptionData) => {
                if (prevOptionData) {
                    return {
                        ...prevOptionData,
                        isFollowing: !prevOptionData.isFollowing,
                    };
                }
                getOptionAgain(true);
                return prevOptionData;
            });
        }
    }, [followUserResponse, getOptionAgain]);

    useEffect(() => {
        setWaiting(gettingOption);
    }, [gettingOption]);

    let buttonText = "a";
    let buttonSymbol = "";
    if (optionData && optionData.isFollowing) {
        buttonText = "Unfollow";
        buttonSymbol = "person_remove";
    }
    if (optionData && !optionData.isFollowing) {
        buttonText = "Follow";
        buttonSymbol = "person_add";
    }

    return (
        <div className={styles["wrapper"]}>
            {errorMessage.length > 0 ? (
                <p className={styles["error-message"]}>{errorMessage}</p>
            ) : null}
            {skeleton || optionData ? (
                <div className={styles["option-container"]}>
                    <User.ImageAndName
                        waiting={waiting}
                        image={
                            optionData && optionData.preferences.profileImage
                                ? {
                                      src: optionData.preferences.profileImage.url,
                                      alt: optionData.preferences.profileImage.alt,
                                  }
                                : { src: "", alt: "" }
                        }
                        displayName={optionData ? optionData.preferences.displayName : " "}
                        accountTag={optionData ? optionData.accountTag : " "}
                        size="m"
                    />
                    {displayFollowButton ? (
                        <Accessibility.Skeleton
                            waiting={waiting}
                            style={{ borderRadius: "9999px" }}
                        >
                            <Buttons.Basic
                                text={buttonText}
                                symbol={buttonSymbol}
                                palette={optionData && optionData.isFollowing ? "red" : "orange"}
                                onClickHandler={() => followUserAgain(true)}
                                disabled={followingUser}
                                otherStyles={{ fontSize: "1.0rem" }}
                            />
                        </Accessibility.Skeleton>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}

export default Option;
