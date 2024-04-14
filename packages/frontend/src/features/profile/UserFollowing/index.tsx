import { useState, useEffect, useContext } from "react";
import * as useAsync from "@/hooks/useAsync";
import { ProfileContext } from "@/features/profile/Main";
import User from "@/components/user";
import getUserFollowing, { Params, Response } from "./utils/getUserFollowing";
import styles from "./index.module.css";

function UserFollowing() {
    const { _id } = useContext(ProfileContext);

    const [following, setFollowing] = useState<Response>([]);
    const [response, setParams, setAttempting] = useAsync.GET<Params, Response>(
        {
            func: getUserFollowing,
            parameters: [{ params: { userId: _id, after: null } }, null],
        },
        true,
    );
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const newState = response ? response.data : [];
        setFollowing(newState || []);
    }, [response]);

    useEffect(() => {
        setAttempting(true);
        setErrorMessage("");
        setParams([{ params: { userId: _id, after: null } }, null]);
    }, [_id, setParams, setAttempting]);

    if (response && response.status === 401) window.location.assign("/");

    useEffect(() => {
        if (response && response.status >= 400 && response.message && response.message.length > 0) {
            setErrorMessage(response.message);
        }
    }, [response]);

    return (
        <>
            {errorMessage.length > 0 ? (
                <p className={styles["error-message"]}>{errorMessage}</p>
            ) : null}
            {following && following.length > 0 ? (
                <div className={styles["following"]}>
                    {following.map((userId) => {
                        return <User.Option _id={userId} key={`following-${userId}`} />;
                    })}
                </div>
            ) : (
                <p className={styles["empty-message"]}>Nothing to see here!</p>
            )}
        </>
    );
}

export default UserFollowing;
