import { useContext, useState, useEffect } from "react";
import { UserContext } from "@/context/user";
import { v4 as uuidv4 } from "uuid";
import Inputs from "@/components/inputs";
import validation from "@shared/validation";
import convertArrayBufferToBase64 from "@/utils/convertArrayBufferToBase64";
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
                `${import.meta.env.VITE_SERVER_DOMAIN}/api/user/${extract("_id")}/preferences/bio`,
                "bio",
            )}
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
                `${import.meta.env.VITE_SERVER_DOMAIN}/api/user/${extract("_id")}/preferences/displayName`,
                "displayName",
            )}
            publishTopic="successful-settings-update-user-preferences-displayName"
        />,
        <FieldUpdater
            field={
                <Inputs.Image
                    labelText="Profile Image"
                    fieldId="profileImage"
                    fieldName="profileImage"
                    initialValue={`${
                        extract("preferences.profileImage")
                            ? (extract("preferences.profileImage") as { url: string }).url
                            : ""
                    }`}
                    disabled={waiting}
                    validator={{ func: validation.user.imageArray }}
                    imageType="profile"
                    imageSizePx={144}
                />
            }
            func={generatePUTAsyncFunction<null>(
                `${import.meta.env.VITE_SERVER_DOMAIN}/api/user/${extract("_id")}/preferences/profileImage`,
                "profileImage",
            )}
            conversionFunc={async (value) => {
                const convertedValue = await convertArrayBufferToBase64(value as ArrayBuffer);
                return convertedValue;
            }}
            publishTopic="successful-settings-update-user-preferences-profileImage"
        />,
        <FieldUpdater
            field={
                <Inputs.Image
                    labelText="Header Image"
                    fieldId="headerImage"
                    fieldName="headerImage"
                    initialValue={`${
                        extract("preferences.headerImage")
                            ? (extract("preferences.headerImage") as { url: string }).url
                            : ""
                    }`}
                    disabled={waiting}
                    validator={{ func: validation.user.imageArray }}
                    imageType="basic"
                    imageWidth="100%"
                    imageAspectRatio="21 / 9"
                />
            }
            func={generatePUTAsyncFunction<null>(
                `${import.meta.env.VITE_SERVER_DOMAIN}/api/user/${extract("_id")}/preferences/headerImage`,
                "headerImage",
            )}
            conversionFunc={async (value) => {
                const convertedValue = await convertArrayBufferToBase64(value as ArrayBuffer);
                return convertedValue;
            }}
            publishTopic="successful-settings-update-user-preferences-headerImage"
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
