/* global describe, test, expect */

import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { LabelTypes } from "../Label";
import { DescriptionTypes } from "../Description";
import { ErrorTypes } from "../Error";
import Select, { SelectTypes } from ".";
import * as validation from "../../utils/validation";

const defaultArgs: SelectTypes = {
    labelText: "label",
    fieldId: "fieldId",
    fieldName: "fieldName",
    initialValue: "",
    onChangeHandler: null,
    disabled: false,
    required: false,
    errorMessage: "",
    validator: null,
    options: [],
    description: "",
};

const renderComponent = (args: SelectTypes = defaultArgs) => {
    return render(
        <Select
            labelText={args.labelText}
            fieldId={args.fieldId}
            fieldName={args.fieldName}
            initialValue={args.initialValue}
            onChangeHandler={args.onChangeHandler}
            disabled={args.disabled}
            required={args.required}
            errorMessage={args.errorMessage}
            validator={args.validator}
            options={args.options}
            description={args.description}
        />,
    );
};

vi.mock("@/components/inputs", () => ({
    default: {
        Label: ({ labelText, fieldId }: LabelTypes) => {
            return <label htmlFor={fieldId}>{labelText}</label>;
        },
        Description: ({ text }: DescriptionTypes) => {
            return <h3 aria-label="input field description">{text}</h3>;
        },
        Error: ({ text }: ErrorTypes) => {
            return <div aria-label="input field error">{text}</div>;
        },
    },
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockValidate = vi.fn((fieldValue, validator, required) => ({
    status: true,
    message: "Valid field.",
}));
vi.mock("../../utils/validation", async () => {
    const actual = await vi.importActual("../../utils/validation");
    return {
        ...actual,
        validate: (
            fieldValue: unknown,
            validator: validation.Validator<unknown>,
            required: boolean,
        ) => mockValidate(fieldValue, validator, required),
    };
});

const mockSizes: React.CSSProperties = {
    fontSize: "1.0rem",
};
const getSizesMock = vi.fn(() => mockSizes);
vi.mock("../../utils/getSizes", () => ({
    default: () => getSizesMock(),
}));

afterEach(() => {
    mockValidate.mockClear();
});

describe("UI/DOM Testing...", () => {
    describe("The <select> element...", () => {
        test(`Should be present in the document`, async () => {
            renderComponent();
            const select = screen.getByRole("combobox");
            expect(select).toBeInTheDocument();
        });
        test(`Should have as many <option> element children as there are options in the 'options'
         prop, as specified`, async () => {
            renderComponent({ ...defaultArgs, options: ["option_1", "option_2", "option_3"] });
            const options = screen.getAllByRole("option");
            expect(options.length).toBe(3);
        });
        test(`Should have a default value equal to the value of the 'initialValue' prop, as
         specified`, async () => {
            renderComponent({ ...defaultArgs, options: ["option_1"], initialValue: "option_1" });
            const select: HTMLSelectElement = screen.getByRole("combobox");
            expect(select.value).toBe("option_1");
        });
        test(`Should have an 'id' attribute with value equal to the value of the 'fieldId' prop, as
         specified`, async () => {
            renderComponent();
            const select: HTMLSelectElement = screen.getByRole("combobox");
            expect(select.getAttribute("id")).toBe(defaultArgs.fieldId);
        });
        test(`Should have a 'name' attribute with value equal to the value of the 'fieldName' prop,
         as specified`, async () => {
            renderComponent();
            const select: HTMLSelectElement = screen.getByRole("combobox");
            expect(select.getAttribute("name")).toBe(defaultArgs.fieldName);
        });
        test(`On change, should invoke the 'mockValidate' utility function, passing the new value
         of the input, the value of the 'validator' prop, as specified, and the value of the
         'required' prop, as specified, as arguments`, async () => {
            const user = userEvent.setup();
            const callback = vi.fn();

            const validator = { func: callback, args: [] };

            renderComponent({
                ...defaultArgs,
                validator,
                options: ["option_1", "option_2", "option_3"],
            });

            const select = screen.getByRole("combobox");
            await user.selectOptions(select, "option_2");

            expect(mockValidate).toHaveBeenCalledWith("option_2", validator, defaultArgs.required);
        });
        test(`On change, should invoke the callback 'onChangeHandler', as specified`, async () => {
            const user = userEvent.setup();
            const callback = vi.fn();

            renderComponent({
                ...defaultArgs,
                onChangeHandler: callback,
                options: ["option_1", "option_2", "option_3"],
            });

            const select = screen.getByRole("combobox");
            await user.selectOptions(select, "option_2");

            expect(callback).toHaveBeenCalledTimes(1);
        });
        test(`Unless the value of the 'disabled' prop is set to 'true'`, async () => {
            const user = userEvent.setup();
            const callback = vi.fn();

            renderComponent({
                ...defaultArgs,
                disabled: true,
                onChangeHandler: callback,
                options: ["option_1", "option_2", "option_3"],
            });

            const select = screen.getByRole("combobox");
            await user.selectOptions(select, "option_2");

            expect(callback).not.toHaveBeenCalled();
        });
    });
    describe("The Label component...", () => {
        test(`Should be present in the document and should be passed the value of the 'label' prop,
         as specified, as its 'labelText' prop`, async () => {
            renderComponent();
            const label = screen.getByText("label");
            expect(label).toBeInTheDocument();
        });
    });
    describe("The Description component...", () => {
        test(`Should be present in the document`, async () => {
            renderComponent();
            const description = screen.getByRole("heading", { name: "input field description" });
            expect(description).toBeInTheDocument();
        });
        test(`Should be passed the value of the 'description' prop, as specified, as its 'text'
         prop`, async () => {
            renderComponent({ ...defaultArgs, description: "description" });
            const description = screen.getByRole("heading", { name: "input field description" });
            expect(description.textContent).toBe("description");
        });
    });
    describe("The Error component...", () => {
        test(`Should not be present in the document if the value of the 'errorMessage' prop is not a
         string with a length of at least 1 character, as specified`, async () => {
            renderComponent();
            const error = screen.queryByRole("generic", { name: "input field error" });
            expect(error).toBeNull();
        });
        test(`Should not be present in the document if the value of the 'disabled' prop is set to
         'true'`, async () => {
            renderComponent({ ...defaultArgs, errorMessage: "error", disabled: true });
            const error = screen.queryByRole("generic", { name: "input field error" });
            expect(error).toBeNull();
        });
        test(`Otherwise, it should be present in the document on mount, and should have been passed
         the value of the 'errorMessage' prop, as specified, to its 'text' prop`, async () => {
            renderComponent({ ...defaultArgs, errorMessage: "error" });
            const error = screen.getByRole("generic", { name: "input field error" });
            expect(error).toBeInTheDocument();
            expect(error.textContent).toBe("error");
        });
        test(`Should be passed the value of the 'message' property from the object returned by the
         validation function (if applicable; this will not occur if the 'validator' prop is
         null/undefined), to its 'text' prop, if the input validation fails on change of the input's
         value`, async () => {
            const user = userEvent.setup();
            mockValidate.mockReturnValueOnce({ status: false, message: "Invalid field." });

            renderComponent({ ...defaultArgs, options: ["option_1", "option_2", "option_3"] });

            const select: HTMLSelectElement = screen.getByRole("combobox");
            await user.selectOptions(select, "option_2");

            const error = screen.getByRole("generic", { name: "input field error" });
            expect(error.textContent).toBe("Invalid field.");
        });
    });
});
