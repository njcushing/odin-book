/* global describe, test, expect */

import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { BasicTypes as ButtonBasicTypes } from "@/components/buttons/components/Basic";
import * as validation from "@/components/inputs/utils/validation";
import Inputs from "@/components/inputs";
import Basic, { BasicTypes } from ".";

const defaultArgs: BasicTypes = {
    title: "Form Title",
    sections: [
        {
            title: "Section Title",
            description: "Section description",
            fields: [
                <Inputs.Text fieldId="1" fieldName="1" labelText="field 1" key="1" />,
                <Inputs.Text fieldId="2" fieldName="2" labelText="field 2" key="2" />,
                <Inputs.Text fieldId="3" fieldName="3" labelText="field 3" required key="3" />,
            ],
        },
    ],
    onChangeHandler: () => {},
    onSubmitHandler: () => {},
    button: {
        text: "text",
        symbol: "symbol",
        label: "label",
        palette: "primary",
        style: { shape: "sharp" },
    },
    enableButtonOnInvalidFields: false,
};

const renderComponent = (args: BasicTypes = defaultArgs) => {
    return render(
        <Basic
            title={args.title}
            sections={args.sections}
            onChangeHandler={args.onChangeHandler}
            onSubmitHandler={args.onSubmitHandler}
            button={args.button}
            enableButtonOnInvalidFields={args.enableButtonOnInvalidFields}
        />,
    );
};

type InputTypes = {
    fieldId: string;
    fieldName: string;
    labelText: string;
};
vi.mock("@/components/inputs", () => ({
    default: {
        Text: ({ fieldId, fieldName, labelText }: InputTypes) => {
            return <input type="text" id={fieldId} name={fieldName} aria-label={labelText}></input>;
        },
    },
}));

vi.mock("@/components/buttons/components/Basic", () => ({
    default: ({ text, label, onClickHandler, palette, style, disabled }: ButtonBasicTypes) => {
        return (
            <button
                type="submit"
                aria-label="basic button"
                onClick={(e) => {
                    if (onClickHandler) onClickHandler(e);
                }}
                data-text={text}
                data-label={label}
                data-palette={palette}
                data-shape={style && style.shape}
                disabled={disabled}
            ></button>
        );
    },
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockValidate = vi.fn((fieldValue, validator, required) => ({
    status: true,
    message: "Valid field.",
}));
vi.mock("@/components/inputs/utils/validation", async () => {
    const actual = await vi.importActual("@/components/inputs/utils/validation");
    return {
        ...actual,
        validate: (
            fieldValue: unknown,
            validator: validation.Validator<unknown>,
            required: boolean,
        ) => mockValidate(fieldValue, validator, required),
    };
});

afterEach(() => {
    mockValidate.mockClear();
});

describe("UI/DOM Testing...", () => {
    describe("Each section specified in the 'sections' prop...", () => {
        test(`Should have a corresponding <section> element`, async () => {
            renderComponent();
            const sections = screen.getAllByLabelText("form section");
            expect(sections.length).toBe(1);
        });
        test(`Should have a title with text content equal to the value of that section's 'title'
         property`, async () => {
            renderComponent();
            const sectionTitles = screen.getAllByRole("heading", { name: "section title" });
            expect(sectionTitles[0].textContent).toBe("Section Title");
        });
        test(`Unless the value of that section's 'title' property is not a string at least 1
         character in length`, async () => {
            renderComponent({
                ...defaultArgs,
                sections: [{ title: "", fields: [] }],
            });
            const sectionTitles = screen.queryAllByRole("heading", { name: "section title" });
            expect(sectionTitles.length).toBe(0);
        });
        test(`Should have a description with text content equal to the value of that section's
         'description' property`, async () => {
            renderComponent();
            const sectionDescriptions = screen.getAllByLabelText("section description");
            expect(sectionDescriptions[0].textContent).toBe("Section description");
        });
        test(`Unless the value of that section's 'title' property is not a string at least 1
         character in length`, async () => {
            renderComponent({
                ...defaultArgs,
                sections: [{ description: "", fields: [] }],
            });
            const sectionDescriptions = screen.queryAllByLabelText("section description");
            expect(sectionDescriptions.length).toBe(0);
        });
    });
    describe("The heading element displaying the requirement message...", () => {
        test(`Should be present in the document if at least one of the input elements specified in
         the 'sections' prop's 'fields' array property has a 'required' property set to 'true'`, async () => {
            renderComponent();
            const requirementMessage = screen.getByRole("heading", { name: "requirement message" });
            expect(requirementMessage).toBeInTheDocument();
        });
    });
    describe("The Basic button component...", () => {
        test(`Should be present in the document`, async () => {
            renderComponent();
            const basic = screen.getByLabelText("basic button");
            expect(basic).toBeInTheDocument();
        });
        test(`Should be passed the value of the 'text' property in the 'button' prop, as specified,
         as the value of its 'text' prop`, async () => {
            renderComponent();
            const basic = screen.getByLabelText("basic button");
            expect(basic.getAttribute("data-text")).toBe("text");
        });
        test(`Or, if the 'button' prop or its 'text' property are not specified, it should be passed
         'Submit' as the value of its 'text' prop`, async () => {
            renderComponent({ ...defaultArgs, button: { ...defaultArgs.button, text: undefined } });
            const basic = screen.getByLabelText("basic button");
            expect(basic.getAttribute("data-text")).toBe("Submit");
        });
        test(`Should be passed the value of the 'label' property in the 'button' prop, as specified,
         as the value of its 'label' prop`, async () => {
            renderComponent();
            const basic = screen.getByLabelText("basic button");
            expect(basic.getAttribute("data-label")).toBe("label");
        });
        test(`Or, if the 'button' prop or its 'label' property are not specified, it should be
         passed 'submit form' as the value of its 'label' prop`, async () => {
            renderComponent({
                ...defaultArgs,
                button: { ...defaultArgs.button, label: undefined },
            });
            const basic = screen.getByLabelText("basic button");
            expect(basic.getAttribute("data-label")).toBe("submit form");
        });
        test(`Should be passed the value of the 'palette' property in the 'button' prop, as
         specified, as the value of its 'palette' prop`, async () => {
            renderComponent();
            const basic = screen.getByLabelText("basic button");
            expect(basic.getAttribute("data-palette")).toBe("primary");
        });
        test(`Or, if the 'button' prop or its 'palette' property are not specified, it should be
         passed 'submit form' as the value of its 'palette' prop`, async () => {
            renderComponent({
                ...defaultArgs,
                button: { ...defaultArgs.button, palette: undefined },
            });
            const basic = screen.getByLabelText("basic button");
            expect(basic.getAttribute("data-palette")).toBe("blue");
        });
        test(`Should be passed the value of the 'style' property in the 'button' prop, as specified,
         as the value of its 'style' prop`, async () => {
            renderComponent();
            const basic = screen.getByLabelText("basic button");
            expect(basic.getAttribute("data-shape")).toStrictEqual("sharp");
        });
        test(`Or, if the 'button' prop or its 'style' property are not specified, it should be
         passed '{ style: "rounded" }' as the value of its 'style' prop`, async () => {
            renderComponent({
                ...defaultArgs,
                button: { ...defaultArgs.button, style: undefined },
            });
            const basic = screen.getByLabelText("basic button");
            expect(basic.getAttribute("data-shape")).toStrictEqual("rounded");
        });
        test(`Should, when clicked, invoke the 'onSubmitHandler' callback prop, as specified`, async () => {
            const user = userEvent.setup();
            const callback = vi.fn((e) => e.preventDefault());

            renderComponent({ ...defaultArgs, onSubmitHandler: callback });

            const basic = screen.getByLabelText("basic button");
            await user.click(basic);

            expect(callback).toHaveBeenCalledTimes(1);
        });
        test(`Should be disabled if the 'button' prop's 'disabled' property is set to 'true'`, async () => {
            renderComponent({ ...defaultArgs, button: { ...defaultArgs.button, disabled: true } });
            const basic: HTMLButtonElement = screen.getByLabelText("basic button");
            expect(basic.disabled).toBe(true);
        });
        test(`Or if there is at least one invalid field`, async () => {
            const user = userEvent.setup();
            mockValidate.mockReturnValue({ status: false, message: "Invalid field." });

            renderComponent({
                ...defaultArgs,
                sections: [
                    {
                        fields: [<Inputs.Text fieldId="1" fieldName="1" labelText="1" key="1" />],
                    },
                ],
            });

            const input = screen.getByLabelText("1");
            await user.type(input, "a");

            const basic: HTMLButtonElement = screen.getByLabelText("basic button");
            expect(basic.disabled).toBe(true);
        });
        test(`Unless the 'enableButtonOnInvalidFields' prop is set to 'true'`, async () => {
            const user = userEvent.setup();
            mockValidate.mockReturnValue({ status: false, message: "Invalid field." });

            renderComponent({
                ...defaultArgs,
                sections: [
                    {
                        fields: [<Inputs.Text fieldId="1" fieldName="1" labelText="1" key="1" />],
                    },
                ],
                enableButtonOnInvalidFields: true,
            });

            const input = screen.getByLabelText("1");
            await user.type(input, "a");

            const basic: HTMLButtonElement = screen.getByLabelText("basic button");
            expect(basic.disabled).toBe(false);
        });
    });
});
describe("Other Functionality Testing...", () => {
    describe("If any fields specified in the 'sections' prop have the same 'fieldName' prop...", () => {
        test(`An error should be thrown`, async () => {
            vi.spyOn(console, "error").mockImplementation(() => {}); // suppress console error
            expect(() =>
                renderComponent({
                    ...defaultArgs,
                    sections: [
                        {
                            fields: [
                                <Inputs.Text fieldId="1" fieldName="1" labelText="1" key="1" />,
                                <Inputs.Text fieldId="2" fieldName="1" labelText="2" key="2" />,
                            ],
                        },
                    ],
                }),
            ).toThrow();
            vi.spyOn(console, "error").mockRestore();
        });
    });
    describe("Whenever the value of any of the inputs are changed...", () => {
        test(`All inputs should be validated using the 'validate' utility function, passing the
         current value of each input, the value of its 'validator' prop, and the value of its
         'required' prop as arguments`, async () => {
            const user = userEvent.setup();
            const validator = {
                func: vi.fn(() => ({ status: true, message: "Valid field." })),
                args: [],
            };

            renderComponent({
                ...defaultArgs,
                sections: [
                    {
                        fields: [
                            <Inputs.Text
                                fieldId="1"
                                fieldName="1"
                                labelText="1"
                                validator={validator}
                                key="1"
                            />,
                        ],
                    },
                ],
            });

            const input = screen.getByLabelText("1");
            await user.type(input, "a");

            expect(mockValidate).toHaveBeenCalledWith("a", validator, false);
        });
        test(`The 'onSubmitHandler' callback prop, as specified, should be invoked`, async () => {
            const user = userEvent.setup();
            const callback = vi.fn();

            renderComponent({
                ...defaultArgs,
                sections: [
                    {
                        fields: [<Inputs.Text fieldId="1" fieldName="1" labelText="1" key="1" />],
                    },
                ],
                onChangeHandler: callback,
            });

            const input = screen.getByLabelText("1");
            await user.type(input, "a");

            expect(callback).toHaveBeenCalled();
        });
    });
});
