/* global describe, test, expect */

import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { LabelTypes } from "../Label";
import { DescriptionTypes } from "../Description";
import { CounterTypes } from "../Counter";
import { ErrorTypes } from "../Error";
import Text, { TextTypes } from ".";
import * as validation from "../../utils/validation";

const defaultArgs: TextTypes = {
    labelText: "label",
    fieldId: "fieldId",
    fieldName: "fieldName",
    initialValue: "",
    onChangeHandler: null,
    disabled: false,
    readOnly: false,
    required: false,
    placeholder: "",
    errorMessage: "",
    validator: null,
    minLength: 0,
    maxLength: 100,
    counter: false,
    type: "text",
    description: "",
};

const renderComponent = (args: TextTypes = defaultArgs) => {
    return render(
        <Text
            labelText={args.labelText}
            fieldId={args.fieldId}
            fieldName={args.fieldName}
            initialValue={args.initialValue}
            onChangeHandler={args.onChangeHandler}
            disabled={args.disabled}
            readOnly={args.readOnly}
            required={args.required}
            placeholder={args.placeholder}
            errorMessage={args.errorMessage}
            validator={args.validator}
            minLength={args.minLength}
            maxLength={args.maxLength}
            counter={args.counter}
            type={args.type}
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
        Counter: ({ count, maxLength }: CounterTypes) => {
            return (
                <div aria-label="input field counter" data-max-length={maxLength}>
                    {count}
                </div>
            );
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
    describe("The <input> element...", () => {
        test(`Should be present in the document`, async () => {
            renderComponent();
            const input = screen.getByRole("textbox");
            expect(input).toBeInTheDocument();
        });
        test(`Should have a default value equal to the value of the 'initialValue' prop, as
         specified`, async () => {
            renderComponent({ ...defaultArgs, initialValue: "text" });
            const input: HTMLInputElement = screen.getByRole("textbox");
            expect(input.value).toBe("text");
        });
        test(`Should have a 'type' attribute with value equal to the value of the 'type' prop, as
         specified`, async () => {
            renderComponent();
            const input: HTMLInputElement = screen.getByRole("textbox");
            expect(input.getAttribute("type")).toBe(defaultArgs.type);
        });
        test(`Should have an 'id' attribute with value equal to the value of the 'fieldId' prop, as
         specified`, async () => {
            renderComponent();
            const input: HTMLInputElement = screen.getByRole("textbox");
            expect(input.getAttribute("id")).toBe(defaultArgs.fieldId);
        });
        test(`Should have a 'name' attribute with value equal to the value of the 'fieldName' prop,
         as specified`, async () => {
            renderComponent();
            const input: HTMLInputElement = screen.getByRole("textbox");
            expect(input.getAttribute("name")).toBe(defaultArgs.fieldName);
        });
        test(`Should have a 'minLength' attribute with value equal to the value of the 'minLength'
         prop, as specified`, async () => {
            renderComponent();
            const input: HTMLInputElement = screen.getByRole("textbox");
            expect(input.getAttribute("minLength")).toBe(`${defaultArgs.minLength}`);
        });
        test(`Should have a 'maxLength' attribute with value equal to the value of the 'maxLength'
         prop, as specified`, async () => {
            renderComponent();
            const input: HTMLInputElement = screen.getByRole("textbox");
            expect(input.getAttribute("maxLength")).toBe(`${defaultArgs.maxLength}`);
        });
        test(`Should have a placeholder equal to the value of the 'placeholder' prop, as specified`, async () => {
            renderComponent({ ...defaultArgs, placeholder: "placeholder" });
            const input: HTMLInputElement = screen.getByRole("textbox");
            expect(input.placeholder).toBe("placeholder");
        });
        test(`On change, should invoke the 'mockValidate' utility function, passing the new value
         of the input, the value of the 'validator' prop, as specified, and the value of the
         'required' prop, as specified, as arguments`, async () => {
            const user = userEvent.setup();
            const callback = vi.fn();

            const validator = { func: callback, args: [] };

            renderComponent({ ...defaultArgs, validator });

            const input = screen.getByRole("textbox");
            await user.type(input, "a");

            expect(mockValidate).toHaveBeenCalledWith("a", validator, defaultArgs.required);
        });
        test(`On change, should invoke the callback 'onChangeHandler', as specified`, async () => {
            const user = userEvent.setup();
            const callback = vi.fn();

            renderComponent({ ...defaultArgs, onChangeHandler: callback });

            const input = screen.getByRole("textbox");
            await user.type(input, "a");

            expect(callback).toHaveBeenCalledTimes(1);
        });
        test(`Unless the value of the 'disabled' prop is set to 'true'`, async () => {
            const user = userEvent.setup();
            const callback = vi.fn();

            renderComponent({ ...defaultArgs, disabled: true, onChangeHandler: callback });

            const input = screen.getByRole("textbox");
            await user.type(input, "a");

            expect(callback).not.toHaveBeenCalled();
        });
        test(`On change, should not change the value of the <input> element if the value of the
         'readOnly' prop is set to 'true'`, async () => {
            const user = userEvent.setup();

            renderComponent({ ...defaultArgs, readOnly: true });

            const input: HTMLInputElement = screen.getByRole("textbox");
            await user.type(input, "a");

            expect(input.value).toBe("");
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
    describe("The Counter component...", () => {
        test(`Should not be present in the document if the value of the 'counter' prop is set to
         'false'`, async () => {
            renderComponent();
            const counter = screen.queryByRole("generic", { name: "input field counter" });
            expect(counter).toBeNull();
        });
        test(`Otherwise, it should be present in the document`, async () => {
            renderComponent({ ...defaultArgs, counter: true });
            const counter = screen.getByRole("generic", { name: "input field counter" });
            expect(counter).toBeInTheDocument();
        });
        test(`Should be passed the current length of the input's value as its 'count' prop, and the
         value of the 'maxLength' prop, as specified, as its 'maxLength' prop`, async () => {
            const user = userEvent.setup();

            renderComponent({ ...defaultArgs, counter: true });

            const input: HTMLInputElement = screen.getByRole("textbox");
            await user.type(input, "aaa");

            const counter = screen.getByRole("generic", { name: "input field counter" });
            expect(counter.textContent).toBe("3");
            expect(counter.getAttribute("data-max-length")).toBe(`${defaultArgs.maxLength}`);
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

            renderComponent({ ...defaultArgs });

            const input: HTMLInputElement = screen.getByRole("textbox");
            await user.type(input, "a");

            const error = screen.getByRole("generic", { name: "input field error" });
            expect(error.textContent).toBe("Invalid field.");
        });
    });
});
