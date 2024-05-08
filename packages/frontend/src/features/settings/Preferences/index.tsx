import { useContext, useState, useEffect } from "react";
import { UserContext } from "@/context/user";
import { v4 as uuidv4 } from "uuid";
import Inputs from "@/components/inputs";
import { theme, themeOptions } from "@shared/validation/user";
import List from "../List";
import FieldUpdater from "../FieldUpdater";
import generatePUTAsyncFunction from "../utils/generatePUTAsyncFunction";
import styles from "./index.module.css";

function Preferences() {
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
                <Inputs.Select
                    labelText="Theme"
                    fieldId="theme"
                    fieldName="theme"
                    initialValue={`${extract("preferences.theme")}`}
                    disabled={waiting}
                    validator={{ func: theme }}
                    options={themeOptions}
                />
            }
            func={generatePUTAsyncFunction<null>(
                `${import.meta.env.VITE_SERVER_DOMAIN}/user/${extract("_id")}/preferences/theme`,
                "theme",
            )}
            publishTopic="successful-settings-update-user-preferences-theme"
        />,
    ];
    /* eslint-enable react/jsx-key */

    return (
        <div className={styles["container"]} key={generateKey}>
            <List title="Preferences" fields={fields} />
        </div>
    );
}

export default Preferences;
