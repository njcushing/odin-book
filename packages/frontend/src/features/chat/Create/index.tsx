import React, { useState } from "react";
import Modals from "@/components/modals";
import Buttons from "@/components/buttons";
import User from "@/components/user";
import { v4 as uuidv4 } from "uuid";
import styles from "./index.module.css";

type CreateTypes = {
    defaultUsers?: string[];
    onCloseClickHandler?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | null;
};

function Create({ defaultUsers = [], onCloseClickHandler = null }: CreateTypes) {
    const [users, setUsers] = useState<string[]>(defaultUsers);
    const [submissionErrors, setSubmissionErrors] = useState<string[]>([]);

    return (
        <Modals.Basic onCloseClickHandler={onCloseClickHandler}>
            <div className={styles["container"]}>
                <h2 className={styles["title"]}>Create a New Chat</h2>
                <div className={styles["content"]}>
                    <User.Selector
                        onChangeHandler={(selectedUsers) =>
                            setUsers(
                                Object.keys(selectedUsers).map((user) => selectedUsers[user]._id),
                            )
                        }
                    />
                    {submissionErrors.length > 0 ? (
                        <div className={styles["errors-list"]}>
                            <p className={styles["submission-errors-title"]}>Submission Errors:</p>
                            <ul
                                className={styles["submission-errors"]}
                                aria-label="message-submission-errors"
                            >
                                {submissionErrors.map((error) => {
                                    return (
                                        <li
                                            className={styles["error"]}
                                            aria-label="message-submission-error"
                                            key={uuidv4()}
                                        >
                                            {error}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ) : null}
                </div>
                <div className={styles["create-button-container"]}>
                    <Buttons.Basic
                        text="Create"
                        palette="green"
                        onClickHandler={() => {
                            // attempt to create chat
                        }}
                        otherStyles={{ fontSize: "1.2rem" }}
                    />
                </div>
            </div>
        </Modals.Basic>
    );
}

export default Create;
