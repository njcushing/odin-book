import React, { useState, useEffect, useCallback, useRef } from "react";
import * as useAsync from "@/hooks/useAsync";
import Buttons from "@/components/buttons";
import { Validator, validate } from "@/components/inputs/utils/validation";
import Accessibility from "@/components/accessibility";
import { PUT } from "@shared/utils/apiFunctionTypes";
import styles from "./index.module.css";

type TField = {
    fieldName: string;
    initialValue?: unknown;
    onChangeHandler?: ((value: unknown) => void) | null;
    validator?: Validator<unknown>;
    required?: boolean;
};

export type TFieldUpdater = {
    field: React.ReactElement<TField>;
    func: PUT<null, { fieldValue: unknown }, unknown>;
    publishTopic?: string;
    onSuccessHandler?: (() => unknown) | null;
    overrideWaiting?: boolean;
};

function FieldUpdater({
    field,
    func,
    publishTopic,
    onSuccessHandler,
    overrideWaiting = false,
}: TFieldUpdater) {
    const [waiting, setWaiting] = useState<boolean>(overrideWaiting);
    const [fieldCurrentValue, setFieldCurrentValue] = useState<unknown>(field.props.initialValue);
    const [buttonEnabled, setButtonEnabled] = useState<boolean>(false);

    const formRef = useRef(null);

    const [asyncResponse, setParams, setAttempting, awaitingResponse] = useAsync.PUT<
        null,
        { fieldValue: unknown },
        Parameters<typeof func>[2]
    >({ func }, false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        if (asyncResponse) {
            if (
                asyncResponse.status >= 400 &&
                asyncResponse.message &&
                asyncResponse.message.length > 0
            ) {
                setErrorMessage(asyncResponse.message);
            } else {
                setErrorMessage("");
            }
        }
    }, [asyncResponse]);

    useEffect(() => {
        if (asyncResponse && asyncResponse.status < 400) {
            if (onSuccessHandler) onSuccessHandler();
            if (publishTopic && publishTopic.length > 0) {
                PubSub.publish(publishTopic, asyncResponse.data);
            }
        }
    }, [asyncResponse, onSuccessHandler, publishTopic]);

    useEffect(() => {
        setWaiting(false);
    }, [awaitingResponse]);

    const calculateFormValidity = useCallback(
        (formData: { [k: string]: FormDataEntryValue }) => {
            const { fieldName, validator, required } = field.props;
            const validField = validate(formData[fieldName], validator || null, required || false);
            setFieldCurrentValue(formData[fieldName]);
            setButtonEnabled(validField.status && formData[fieldName] !== field.props.initialValue);
        },
        [field.props],
    );

    return (
        <form
            className={styles["form"]}
            onChange={(e: React.ChangeEvent<HTMLFormElement>) => {
                const formData = new FormData(e.currentTarget);
                const formFields = Object.fromEntries(formData);
                calculateFormValidity(formFields);
            }}
            ref={formRef}
        >
            <div className={styles["container"]}>
                {field}
                {errorMessage.length > 0 ? (
                    <p className={styles["error-message"]}>{errorMessage}</p>
                ) : null}
                {fieldCurrentValue !== field.props.initialValue ? (
                    <div className={styles["confirm-changes-button-container"]}>
                        <Buttons.Basic
                            type="submit"
                            text={!waiting ? "Confirm Changes" : ""}
                            onClickHandler={() => {
                                setErrorMessage("");
                                setParams([{ body: { fieldValue: fieldCurrentValue } }, null]);
                                setAttempting(true);
                            }}
                            disabled={waiting || !buttonEnabled}
                            palette="green"
                            otherStyles={{ fontSize: "1.0rem", padding: "0.2rem 0.6rem" }}
                        >
                            {waiting ? (
                                <Accessibility.WaitingWheel
                                    containerStyles={{
                                        padding: "0.1rem",
                                    }}
                                    wheelStyles={{
                                        width: "0.6rem",
                                        height: "0.6rem",
                                        borderWidth: "3px",
                                        borderTopWidth: "3px",
                                    }}
                                />
                            ) : null}
                        </Buttons.Basic>
                    </div>
                ) : null}
            </div>
        </form>
    );
}

export default FieldUpdater;
