import { useContext, useState, useEffect } from "react";
import { UserContext } from "@/context/user";
import { v4 as uuidv4 } from "uuid";
import Inputs from "@/components/inputs";
import validation from "@shared/validation";
import List from "../List";
import FieldUpdater from "../FieldUpdater";
import generatePUTAsyncFunction from "../utils/generatePUTAsyncFunction";
import styles from "./index.module.css";

function Profile() {
    const { user, extract, awaitingResponse } = useContext(UserContext);

    const [waiting, setWaiting] = useState<boolean>(true);
    const [generateKey, setGenerateKey] = useState(uuidv4());

    useEffect(() => {
        setGenerateKey(uuidv4());
    }, [user]);

    useEffect(() => {
        setWaiting(awaitingResponse);
    }, [awaitingResponse]);

    // disabling linter rule here because it's not relevant (elements being extracted from array later)
    /* eslint-disable react/jsx-key */
    const fields = [
        <FieldUpdater
            field={
                <Inputs.TextArea
                    labelText="Bio"
                    fieldId="bio"
                    fieldName="bio"
                    initialValue={`${extract("preferences.bio")}`}
                    disabled={waiting}
                    maxLength={500}
                    counter
                />
            }
            func={generatePUTAsyncFunction<null>(
                `${import.meta.env.VITE_SERVER_DOMAIN}/user/${extract("_id")}/preferences/bio`,
                "bio",
            )}
            publishResponseOnSuccess
            publishTopic="successful-settings-update-user-preferences-bio"
        />,
        <FieldUpdater
            field={
                <Inputs.Text
                    labelText="Display Name"
                    fieldId="displayName"
                    fieldName="displayName"
                    initialValue={`${extract("preferences.displayName")}`}
                    disabled={waiting}
                    validator={{ func: validation.user.displayName }}
                />
            }
            func={generatePUTAsyncFunction<null>(
                `${import.meta.env.VITE_SERVER_DOMAIN}/user/${extract("_id")}/preferences/displayName`,
                "displayName",
            )}
            publishResponseOnSuccess
            publishTopic="successful-settings-update-user-preferences-displayName"
        />,
    ];
    /* eslint-enable react/jsx-key */

    return (
        <div className={styles["container"]} key={generateKey}>
            <List title="Profile" fields={fields} />
        </div>
    );
}

export default Profile;
