import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "@/context/user";
import * as useAsync from "@/hooks/useAsync";
import mongoose from "mongoose";
import Accessibility from "@/components/accessibility";
import User from "@/components/user";
import getRecommendedUsers, { Params, Response } from "./utils/getRecommendedUsers";
import styles from "./index.module.css";

export type TRecommendedUsers = {
    style?: React.CSSProperties;
};

function RecommendedUsers({ style }: TRecommendedUsers) {
    const { user, extract } = useContext(UserContext);

    const [waiting, setWaiting] = useState(true);

    const [users, setUsers] = useState<Response>([]);
    const [response, setParams, setAttempting, creatingMessage] = useAsync.GET<Params, Response>(
        {
            func: getRecommendedUsers,
            parameters: [
                {
                    params: {
                        userId: extract("_id") as mongoose.Types.ObjectId | undefined | null,
                    },
                },
                null,
            ],
        },
        false,
    );
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const newState = response ? response.data : [];
        setUsers(() => newState);
    }, [response]);

    useEffect(() => {
        setAttempting(true);
        setErrorMessage("");
        setParams([
            {
                params: {
                    userId: extract("_id") as mongoose.Types.ObjectId | undefined | null,
                },
            },
            null,
        ]);
    }, [user, extract, setParams, setAttempting]);

    useEffect(() => {
        if (response) {
            if (response.status >= 400 && response.message && response.message.length > 0) {
                setErrorMessage(response.message);
            } else {
                setErrorMessage("");
            }
        }
    }, [response]);

    useEffect(() => {
        setWaiting(creatingMessage);
    }, [creatingMessage]);

    const errorMessageElement =
        errorMessage.length > 0 ? <p className={styles["error-message"]}>{errorMessage}</p> : null;

    const userList =
        users && users.length > 0 ? (
            <ul className={styles["user-list"]}>
                {users.map((userId) => {
                    return (
                        <div
                            className={styles["user-container"]}
                            key={`recommended-user-${userId}`}
                        >
                            <User.Option _id={userId} skeleton />
                        </div>
                    );
                })}
            </ul>
        ) : (
            <p className={styles["no-users-message"]}>
                We don&apos;t have any users to recommend right now.
            </p>
        );

    return (
        <div className={styles["container"]} style={style}>
            {errorMessageElement}
            <h4 className={styles["title"]}>Recommended Users</h4>
            {!waiting ? userList : <Accessibility.WaitingWheel />}
        </div>
    );
}

export default RecommendedUsers;
