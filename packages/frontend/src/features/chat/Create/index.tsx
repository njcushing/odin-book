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
    onSuccessHandler?: (() => unknown) | null;
};

function Create({
    defaultParticipants = [],
    onCloseClickHandler = null,
    onSuccessHandler = null,
}: CreateTypes) {
    const [participants, setParticipants] =
        useState<mongoose.Types.ObjectId[]>(defaultParticipants);

    const [waiting, setWaiting] = useState<boolean>(false);

    const [response, setParams, setAttempting, creatingChat] = useAsync.POST<null, Body, Response>(
        { func: createChat },
        false,
    );
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        if (response && response.status >= 400 && response.message && response.message.length > 0) {
            setErrorMessage(response.message);
        }
    }, [response]);

    useEffect(() => {
        if (response && response.status < 400) {
            if (onSuccessHandler) onSuccessHandler();
        }
    }, [response, onSuccessHandler]);

    useEffect(() => {
        setWaiting(creatingChat);
    }, [creatingChat]);

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
                        disabled={waiting}
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
                        disabled={waiting || participants.length === 0}
                        otherStyles={{ fontSize: "1.2rem" }}
                    />
                </div>
            </div>
        </Modals.Basic>
    );
}

export default Create;
