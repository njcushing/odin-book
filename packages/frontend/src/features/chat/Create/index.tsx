import React, { useState, useEffect } from "react";
import * as useAsync from "@/hooks/useAsync";
import Modals from "@/components/modals";
import Buttons from "@/components/buttons";
import User from "@/components/user";
import mongoose from "mongoose";
import createChat, { Body, Response } from "./utils/createChat";
import styles from "./index.module.css";

type CreateTypes = {
    defaultParticipants?: mongoose.Types.ObjectId[];
    onCloseClickHandler?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | null;
};

function Create({ defaultParticipants = [], onCloseClickHandler = null }: CreateTypes) {
    const [participants, setParticipants] =
        useState<mongoose.Types.ObjectId[]>(defaultParticipants);

    const [response, setParams, setAttempting] = useAsync.POST<null, Body, Response>(
        { func: createChat },
        false,
    );
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        if (response && response.status >= 400 && response.message && response.message.length > 0) {
            setErrorMessage(response.message);
        }
    }, [response]);

    return (
        <Modals.Basic onCloseClickHandler={onCloseClickHandler}>
            <div className={styles["container"]}>
                <h2 className={styles["title"]}>Create a New Chat</h2>
                <div className={styles["content"]}>
                    <User.Selector
                        onChangeHandler={(selectedUsers) =>
                            setParticipants(
                                Object.keys(selectedUsers).map((user) => selectedUsers[user]._id),
                            )
                        }
                    />
                </div>
                {errorMessage.length > 0 ? (
                    <p className={styles["error-message"]}>{errorMessage}</p>
                ) : null}
                <div className={styles["create-button-container"]}>
                    <Buttons.Basic
                        text="Create"
                        palette="green"
                        onClickHandler={() => {
                            setErrorMessage("");
                            setParams([{ body: { participants } }, null]);
                            setAttempting(true);
                        }}
                        disabled={participants.length === 0}
                        otherStyles={{ fontSize: "1.2rem" }}
                    />
                </div>
            </div>
        </Modals.Basic>
    );
}

export default Create;
