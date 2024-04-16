import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/context/user";
import * as useAsync from "@/hooks/useAsync";
import Buttons from "@/components/buttons";
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
};

function Option({ _id, overrideOptionData }: OptionTypes) {
    const { user, extract } = useContext(UserContext);

    const [displayFollowButton, setDisplayFollowButton] = useState<boolean>(true);

    useEffect(() => {
        setDisplayFollowButton(extract("_id") !== _id);
    }, [user, _id, extract]);

    // get option api handling
    const [optionData, setOptionData] = useState<GetOptionResponse>(null);
    const [getOptionResponse /* setGetOptionParams */, , getOptionAgain] = useAsync.GET<
        GetOptionParams,
        GetOptionResponse
    >(
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
    const [followUserResponse /* setFollowUserParams */, , followUserAgain] = useAsync.PUT<
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
    }, [overrideOptionData, getOptionAgain, followUserResponse]);

    return (
        <div className={styles["wrapper"]}>
            {errorMessage.length > 0 ? (
                <p className={styles["error-message"]}>{errorMessage}</p>
            ) : null}
            {optionData && (
                <div className={styles["option-container"]}>
                    <User.ImageAndName
                        image={
                            optionData.preferences.profileImage
                                ? {
                                      src: optionData.preferences.profileImage.url,
                                      alt: optionData.preferences.profileImage.alt,
                                  }
                                : { src: "", alt: "" }
                        }
                        displayName={optionData.preferences.displayName}
                        accountTag={optionData.accountTag}
                        size="m"
                    />
                    {displayFollowButton ? (
                        <Buttons.Basic
                            text={optionData.isFollowing ? "Unfollow" : "Follow"}
                            symbol={optionData.isFollowing ? "person_remove" : "person_add"}
                            palette={optionData.isFollowing ? "red" : "orange"}
                            onClickHandler={() => followUserAgain(true)}
                            otherStyles={{ fontSize: "1.0rem" }}
                        />
                    ) : null}
                </div>
            )}
        </div>
    );
}

export default Option;
