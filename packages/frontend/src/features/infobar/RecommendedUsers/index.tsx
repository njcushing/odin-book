import React from "react";
import User from "@/components/user";
import mongoose from "mongoose";
import styles from "./index.module.css";

export type TRecommendedUsers = {
    users: mongoose.Types.ObjectId[];
    style?: React.CSSProperties;
};

function RecommendedUsers({ users, style }: TRecommendedUsers) {
    return (
        <div className={styles["container"]} style={style}>
            <h4 className={styles["title"]}>Recommended Users</h4>
            {users.length > 0 ? (
                <ul className={styles["users-list"]}>
                    {users.map((user) => {
                        return (
                            <div
                                className={styles["user-container"]}
                                key={`recommended-user-${user}`}
                            >
                                <User.Option _id={user} skeleton />
                            </div>
                        );
                    })}
                </ul>
            ) : (
                <p className={styles["no-users-message"]}>
                    We don&apos;t have any users to recommend right now.
                </p>
            )}
        </div>
    );
}

export default RecommendedUsers;
