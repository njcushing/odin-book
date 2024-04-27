import { useState, useEffect } from "react";
import * as useAsync from "@/hooks/useAsync";
import Inputs from "@/components/inputs";
import Buttons from "@/components/buttons";
import { BasicTypes as ButtonBasicTypes } from "@/components/buttons/components/Basic";
import getUserOverviewFromTag, { Params, Response } from "./utils/getUserOverviewFromTag";
import User from "../..";
import styles from "./index.module.css";

export type FinderTypes = {
    placeholder?: string;
    button?: ButtonBasicTypes;
    clearFindOnClick?: boolean;
    onClickHandler?: ((user: Exclude<Response, null>) => void) | null;
    disabled?: boolean;
};

function Finder({
    placeholder,
    button,
    onClickHandler,
    clearFindOnClick,
    disabled = false,
}: FinderTypes) {
    const [currentAccountTag, setCurrentAccountTag] = useState<string>("");

    const [foundUser, setFoundUser] = useState<Response>(null);
    const [response, setParams, setAttempting] = useAsync.GET<Params, Response>(
        {
            func: getUserOverviewFromTag,
            parameters: [{ params: { accountTag: currentAccountTag } }, null],
        },
        true,
    );

    useEffect(() => {
        const newState = response ? response.data : null;
        setFoundUser(newState);
    }, [response]);

    useEffect(() => {
        setParams([{ params: { accountTag: currentAccountTag } }, null]);
    }, [currentAccountTag, setParams]);

    return (
        <div className={styles["container"]}>
            <Inputs.Search
                onChangeHandler={(e) => {
                    setFoundUser(null);
                    setCurrentAccountTag(e.target.value);
                }}
                disabled={disabled}
                placeholder={placeholder}
                onSearchHandler={() => setAttempting(true)}
                searchAfterDelay={0}
            />
            {foundUser && (
                <div className={styles["found-user"]}>
                    <User.ImageAndName
                        image={
                            foundUser.preferences.profileImage
                                ? {
                                      src: foundUser.preferences.profileImage.url,
                                      alt: foundUser.preferences.profileImage.alt,
                                  }
                                : { src: "", alt: "" }
                        }
                        displayName={foundUser.preferences.displayName}
                        accountTag={foundUser.accountTag}
                        size="m"
                    />
                    {button && (
                        <Buttons.Basic
                            {...button}
                            onClickHandler={() => {
                                if (onClickHandler) onClickHandler(foundUser);
                                if (clearFindOnClick) setFoundUser(null);
                            }}
                            disabled={disabled}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default Finder;
