import React, { useState, useEffect, useCallback, useRef } from "react";
import ButtonBasic, { BasicTypes as ButtonBasicTypes } from "@/components/buttons/components/Basic";
import * as extendedTypes from "@shared/utils/extendedTypes";
import * as validation from "@/components/inputs/utils/validation";
import { getStyles } from "./styles";

type CurrentFormDataType = { [k: string]: FormDataEntryValue };

type FieldTypes = {
    fieldName: string;
    validator?: validation.Validator<unknown>;
    required: boolean;
};

type SectionTypes = {
    title?: string;
    description?: string;
    fields: React.ReactElement<FieldTypes>[];
};

export type BasicTypes = {
    title?: string;
    sections?: SectionTypes[];
    onChangeHandler?: (event: React.FormEvent<HTMLFormElement>, currentlyValid: boolean) => void;
    onSubmitHandler?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    button?: ButtonBasicTypes;
    enableButtonOnInvalidFields?: boolean;
    appearance?: "plain" | "1";
};

const createSection = (
    section: SectionTypes,
    i: number,
    activeStyles: { [key: string]: string | undefined },
): React.ReactElement => {
    return (
        <section
            className={activeStyles["section"]}
            data-title-present={!!(section.title && section.title.length > 0)}
            aria-label="form section"
            key={section.title && section.title.length > 0 ? section.title : i || i}
        >
            {section.title && section.title.length > 0 ? (
                <h4 className={activeStyles["section-title"]} aria-label="section title">
                    {section.title}
                </h4>
            ) : null}
            {section.description && section.description.length > 0 ? (
                <p className={activeStyles["section-description"]} aria-label="section description">
                    {section.description}
                </p>
            ) : null}
            {section.fields.map((field) => (
                <div key={field.props.fieldName}>{field}</div>
            ))}
        </section>
    );
};

function Basic({
    title = "Form Title",
    sections = [],
    onChangeHandler,
    onSubmitHandler,
    button,
    enableButtonOnInvalidFields = false,
    appearance = "1",
}: BasicTypes): React.ReactElement {
    const [requirementMessage, setRequirementMessage] = useState<boolean>(false);
    const [disabledButton, setDisabledButton] = useState<boolean>(false);

    const activeStyles = getStyles(appearance);

    // warn of duplicate fieldName prop values in inputs
    useEffect(() => {
        let requiredField = false;
        const fieldNames = new Set();
        sections.forEach((section) =>
            section.fields.forEach((field) => {
                // check duplicate fieldNames
                const { fieldName } = field.props;
                if (fieldNames.has(fieldName)) {
                    throw new Error(
                        `WARNING: Duplicate 'fieldName': '${fieldName}' found in Input components provided to Basic form component. This may lead to unintended results.`,
                    );
                } else fieldNames.add(fieldName);
                // check to see if requirement message needs to be displayed
                const { required } = field.props;
                if (required) requiredField = true;
            }),
        );
        if (requiredField !== requirementMessage) setRequirementMessage(requiredField);
    }, [sections, requirementMessage]);

    // check to see if requirement message needs to be displayed
    useEffect(() => {}, [sections]);

    const calculateFormValidity = useCallback(
        (formData: CurrentFormDataType) => {
            let valid = true;

            // loop through all input-based components provided and validate their input values
            sections.forEach((section) =>
                section.fields.forEach((field) => {
                    const { fieldName, validator, required } = field.props;
                    const validField = validation.validate(
                        formData[fieldName],
                        validator || null,
                        required || false,
                    );
                    if (!validField.status) valid = false;
                }),
            );

            setDisabledButton(!valid && !enableButtonOnInvalidFields);

            return valid;
        },
        [sections, enableButtonOnInvalidFields],
    );

    // initialise & update currentFormData state
    const formRef = useRef(null);
    useEffect(() => {
        let formRefCurrent: HTMLFormElement;
        if (formRef.current) {
            formRefCurrent = formRef.current;
            const formData = new FormData(formRefCurrent);
            const formFields = Object.fromEntries(formData);
            calculateFormValidity(formFields);
        }
    }, [sections, calculateFormValidity]);

    return (
        <form
            className={activeStyles["form"]}
            onChange={(e: React.ChangeEvent<HTMLFormElement>) => {
                const formData = new FormData(e.currentTarget);
                const formFields = Object.fromEntries(formData);

                const valid = calculateFormValidity(formFields);

                if (onChangeHandler) onChangeHandler(e, valid);
            }}
            ref={formRef}
        >
            <h3 className={activeStyles["title"]}>{title}</h3>
            {requirementMessage ? (
                <h4
                    className={activeStyles["requirement-message"]}
                    aria-label="requirement message"
                >
                    All fields marked with <strong>*</strong> are <strong>required</strong>.
                </h4>
            ) : null}
            {sections.map((section, i) => createSection(section, i, activeStyles))}
            <section className={activeStyles["submit-section"]}>
                <ButtonBasic
                    type="submit"
                    text={(button && button.text) || "Submit"}
                    label={(button && button.label) || "submit form"}
                    onClickHandler={(e: React.MouseEvent<HTMLButtonElement>): void => {
                        if (onSubmitHandler) onSubmitHandler(e);
                    }}
                    disabled={disabledButton || (button && button.disabled) || false}
                    palette={(button && button.palette) || "blue"}
                    style={(button && button.style) || { shape: "rounded" }}
                    otherStyles={{ fontSize: "1.1rem" }}
                />
            </section>
        </form>
    );
}

export default Basic;
