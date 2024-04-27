import React, { useState, useEffect } from "react";
import * as useAsync from "@/hooks/useAsync";
import Modals from "@/components/modals";
import Buttons from "@/components/buttons";
import User from "@/components/user";
import mongoose from "mongoose";
import addParticipantsToChat, { Params, Body, Response } from "./utils/addParticipantsToChat";
import styles from "./index.module.css";

type AddUsersTypes = {
    chatId: mongoose.Types.ObjectId;
    defaultParticipants?: mongoose.Types.ObjectId[];
    onCloseClickHandler?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | null;
    onSuccessHandler?: (() => void) | null;
};

function AddUsers({
    chatId,
    defaultParticipants = [],
    onCloseClickHandler = null,
    onSuccessHandler = null,
}: AddUsersTypes) {
    const [participants, setParticipants] =
        useState<mongoose.Types.ObjectId[]>(defaultParticipants);

    const [waiting, setWaiting] = useState<boolean>(false);

    const [response, setParams, setAttempting, addingParticipants] = useAsync.PUT<
        Params,
        Body,
        Response
    >(
        {
            func: addParticipantsToChat,
            parameters: [
                {
                    params: { chatId },
                    body: { participants },
                },
                null,
            ],
        },
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
        setWaiting(addingParticipants);
    }, [addingParticipants]);

    return (
        <Modals.Basic onCloseClickHandler={onCloseClickHandler}>
            <div className={styles["container"]}>
                <h2 className={styles["title"]}>Add Users to Chat</h2>
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
                <div className={styles["add-users-button-container"]}>
                    <Buttons.Basic
                        text="Add Users"
                        palette="green"
                        onClickHandler={() => {
                            setErrorMessage("");
                            setParams([
                                {
                                    params: { chatId },
                                    body: { participants },
                                },
                                null,
                            ]);
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

export default AddUsers;
