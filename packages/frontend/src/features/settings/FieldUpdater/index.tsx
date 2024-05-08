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
    conversionFunc?: ((value: unknown) => unknown) | ((value: unknown) => Promise<unknown>);
    publishTopic?: string;
    onSuccessHandler?: (() => unknown) | null;
    overrideWaiting?: boolean;
};

function FieldUpdater({
    field,
    func,
    conversionFunc,
    publishTopic,
    onSuccessHandler,
    overrideWaiting = false,
}: TFieldUpdater) {
    const [waiting, setWaiting] = useState<boolean>(overrideWaiting);
    const [fieldInitialValue, setFieldInitialValue] = useState<unknown>(field.props.initialValue);
    const [fieldCurrentValue, setFieldCurrentValue] = useState<unknown>(field.props.initialValue);
    const [buttonEnabled, setButtonEnabled] = useState<boolean>(false);
    const [asyncResponseStored, setAsyncResponseStored] = useState<{
        status: number;
        message: string | null;
        data?: unknown;
    } | null>(null);

    const formRef = useRef(null);

    const [asyncResponse, setParams, setAttempting, awaitingResponse] = useAsync.PUT<
        null,
        { fieldValue: unknown },
        Parameters<typeof func>[2]
    >({ func }, false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        setAsyncResponseStored(asyncResponse);
    }, [asyncResponse]);

    useEffect(() => {
        if (asyncResponseStored) {
            if (
                asyncResponseStored.status >= 400 &&
                asyncResponseStored.message &&
                asyncResponseStored.message.length > 0
            ) {
                setErrorMessage(asyncResponseStored.message);
            } else {
                setErrorMessage("");
            }
            setAsyncResponseStored(null);
        }
    }, [asyncResponseStored]);

    useEffect(() => {
        if (asyncResponseStored && asyncResponseStored.status < 400) {
            if (onSuccessHandler) onSuccessHandler();
            if (publishTopic && publishTopic.length > 0) {
                PubSub.publish(publishTopic, asyncResponseStored.data);
            }
            setFieldInitialValue(fieldCurrentValue);
        }
    }, [asyncResponseStored, onSuccessHandler, publishTopic, fieldCurrentValue]);

    useEffect(() => {
        setWaiting(awaitingResponse);
    }, [awaitingResponse]);

    const calculateFormValidity = useCallback(
        async (formData: { [k: string]: FormDataEntryValue }) => {
            const { fieldName, validator, required } = field.props;
            let value = formData[fieldName];

            // for files, convert File object in form data back into array buffer
            if (value instanceof File) {
                await new Promise<void>((resolve) => {
                    const read = new FileReader();
                    read.readAsArrayBuffer(value as File);
                    read.onloadend = () => {
                        value = new Uint8Array(
                            read.result as ArrayBuffer,
                        ) as unknown as FormDataEntryValue;
                        resolve();
                    };
                });
            }

            const validField = validate(value, validator || null, required || false);
            setFieldCurrentValue(value);
            setButtonEnabled(validField.status && value !== fieldInitialValue);
        },
        [field.props, fieldInitialValue],
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
                {fieldCurrentValue !== fieldInitialValue ? (
                    <div className={styles["confirm-changes-button-container"]}>
                        <Buttons.Basic
                            type="submit"
                            text={!waiting ? "Confirm Changes" : ""}
                            onClickHandler={async () => {
                                setErrorMessage("");
                                const fieldValue = conversionFunc
                                    ? await conversionFunc(fieldCurrentValue)
                                    : fieldCurrentValue;
                                setParams([{ body: { fieldValue } }, null]);
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
