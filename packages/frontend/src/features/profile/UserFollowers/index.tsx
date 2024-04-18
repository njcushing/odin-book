import { useState, useEffect, useContext } from "react";
import * as useAsync from "@/hooks/useAsync";
import { ProfileContext } from "@/features/profile/Main";
import User from "@/components/user";
import Accessibility from "@/components/accessibility";
import getUserFollowers, { Params, Response } from "./utils/getUserFollowers";
import styles from "./index.module.css";

function UserFollowers() {
    const { _id } = useContext(ProfileContext);

    const [waiting, setWaiting] = useState(true);

    const [followers, setFollowers] = useState<Response>([]);
    const [response, setParams, setAttempting, gettingFollowers] = useAsync.GET<Params, Response>(
        {
            func: getUserFollowers,
            parameters: [{ params: { userId: _id, after: null } }, null],
        },
        true,
    );
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const newState = response ? response.data : [];
        setFollowers(newState || []);
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
        } else {
            setErrorMessage("");
        }
    }, [response]);

    useEffect(() => {
        setWaiting(gettingFollowers);
    }, [gettingFollowers]);

    return !waiting ? (
        <>
            {errorMessage.length > 0 ? (
                <p className={styles["error-message"]}>{errorMessage}</p>
            ) : null}
            {followers && followers.length > 0 ? (
                <div className={styles["followers"]}>
                    {followers.map((userId) => {
                        return <User.Option _id={userId} skeleton key={`follower-${userId}`} />;
                    })}
                </div>
            ) : (
                <p className={styles["empty-message"]}>Nothing to see here!</p>
            )}
        </>
    ) : (
        <Accessibility.WaitingWheel />
    );
}

export default UserFollowers;
