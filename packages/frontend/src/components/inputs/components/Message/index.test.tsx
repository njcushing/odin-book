/* global describe, test, expect */

import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { BasicTypes } from "@/components/buttons/components/Basic";
import { TextAreaTypes } from "../TextArea";
import { FileTypes } from "../File";
import Message, { MessageTypes } from ".";

const defaultArgs: MessageTypes = {
    initialText: "",
    textFieldId: "textId",
    textFieldName: "textName",
    placeholder: "",
    initialImages: {},
    imageFieldId: "imageId",
    imageFieldName: "imageName",
    textValidator: null,
    imageValidator: null,
    onSendHandler: null,
    submissionErrors: [],
    sending: false,
};

const renderComponent = (args: MessageTypes = defaultArgs) => {
    return render(
        <Message
            initialText={args.initialText}
            textFieldId={args.textFieldId}
            textFieldName={args.textFieldName}
            placeholder={args.placeholder}
            initialImages={args.initialImages}
            imageFieldId={args.imageFieldId}
            imageFieldName={args.imageFieldName}
            textValidator={args.textValidator}
            imageValidator={args.imageValidator}
            onSendHandler={args.onSendHandler}
            submissionErrors={args.submissionErrors}
            sending={args.sending}
        />,
    );
};

const mockFiles = {
    file_1: {
        data: new Uint8Array([]),
        file: new File(["data"], "file_1.png", {
            type: "image/png",
        }),
    },
};

vi.mock("@/components/inputs", () => ({
    default: {
        TextArea: ({
            fieldId,
            fieldName,
            initialValue,
            onChangeHandler,
            placeholder,
            validator,
        }: TextAreaTypes) => {
            return (
                <textarea
                    aria-label="input field textarea"
                    id={fieldId}
                    name={fieldName}
                    defaultValue={initialValue || ""}
                    onChange={(e) => {
                        if (onChangeHandler) onChangeHandler(e);
                    }}
                    placeholder={placeholder || ""}
                    data-validator={validator}
                ></textarea>
            );
        },
        File: ({ fieldId, fieldName, validator, onUpdateHandler }: FileTypes) => {
            return (
                <input
                    type="file"
                    aria-label="input field file"
                    id={fieldId}
                    name={fieldName}
                    data-validator={validator}
                    onChange={() => {
                        if (onUpdateHandler) onUpdateHandler(mockFiles);
                    }}
                ></input>
            );
        },
    },
}));

vi.mock("@/components/buttons", () => ({
    default: {
        Basic: ({ onClickHandler }: BasicTypes) => {
            return (
                <button
                    type="button"
                    aria-label="basic button"
                    onClick={(e) => {
                        if (onClickHandler) onClickHandler(e);
                    }}
                ></button>
            );
        },
    },
}));

describe("UI/DOM Testing...", () => {
    describe("The TextArea input component...", () => {
        test(`Should be present in the document`, async () => {
            renderComponent();
            const textarea = screen.getByRole("textbox", { name: "input field textarea" });
            expect(textarea).toBeInTheDocument();
        });
        test(`Should be passed the value of the 'initialText' prop, as specified, as its
         'initialValue' prop`, async () => {
            renderComponent({ ...defaultArgs, initialText: "text" });
            const textarea: HTMLTextAreaElement = screen.getByRole("textbox", {
                name: "input field textarea",
            });
            expect(textarea.value).toBe("text");
        });
        test(`Should be passed the value of the 'textFieldId' prop, as specified, as its
         'fieldId' prop`, async () => {
            renderComponent();
            const textarea = screen.getByRole("textbox", { name: "input field textarea" });
            expect(textarea.getAttribute("id")).toBe(defaultArgs.textFieldId);
        });
        test(`Should be passed the value of the 'textFieldName' prop, as specified, as its
         'fieldName' prop`, async () => {
            renderComponent();
            const textarea = screen.getByRole("textbox", { name: "input field textarea" });
            expect(textarea.getAttribute("name")).toBe(defaultArgs.textFieldName);
        });
        test(`Should be passed the value of the 'textValidator' prop, as specified, as its
         'validator' prop`, async () => {
            renderComponent();
            const textarea = screen.getByRole("textbox", { name: "input field textarea" });
            expect(textarea.getAttribute("data-field-validator")).toBe(defaultArgs.textValidator);
        });
        test(`Should be passed the value of the 'placeholder' prop, as specified, as its
         'placeholder' prop`, async () => {
            renderComponent({ ...defaultArgs, placeholder: "placeholder" });
            const textarea: HTMLTextAreaElement = screen.getByRole("textbox", {
                name: "input field textarea",
            });
            expect(textarea.placeholder).toBe("placeholder");
        });
    });
    describe("The File input component...", () => {
        test(`Should be present in the document`, async () => {
            renderComponent();
            const file = screen.getByLabelText("input field file");
            expect(file).toBeInTheDocument();
        });
        test(`Should be passed the value of the 'imageFieldId' prop, as specified, as its
         'fieldId' prop`, async () => {
            renderComponent();
            const file = screen.getByLabelText("input field file");
            expect(file.getAttribute("id")).toBe(defaultArgs.imageFieldId);
        });
        test(`Should be passed the value of the 'imageFieldName' prop, as specified, as its
         'fieldName' prop`, async () => {
            renderComponent();
            const file = screen.getByLabelText("input field file");
            expect(file.getAttribute("name")).toBe(defaultArgs.imageFieldName);
        });
        test(`Should be passed the value of the 'textValidator' prop, as specified, as its
         'validator' prop`, async () => {
            renderComponent();
            const file = screen.getByLabelText("input field file");
            expect(file.getAttribute("data-field-validator")).toBe(defaultArgs.imageValidator);
        });
    });
    describe("The Basic button component...", () => {
        test(`Should be present in the document`, async () => {
            renderComponent();
            const basic = screen.getByLabelText("basic button");
            expect(basic).toBeInTheDocument();
        });
        test(`When clicked, should invoke the callback 'onSendHandler' prop, as specified, passing
         the current value of the TextArea component and the current value of the File component
         as arguments`, async () => {
            const user = userEvent.setup();
            const callback = vi.fn();

            renderComponent({ ...defaultArgs, onSendHandler: callback });

            const textarea = screen.getByRole("textbox", { name: "input field textarea" });
            await user.type(textarea, "example text");

            const file = screen.getByLabelText("input field file");
            /*
             *  Uploaded value won't matter as we have mocked the return value of the
             *  'onChangeHandler' passed to the File component
             */
            await user.upload(file, mockFiles.file_1.file);

            const basic = screen.getByLabelText("basic button");
            await user.click(basic);

            expect(callback).toHaveBeenCalledWith("example text", mockFiles);
        });
    });
    describe("The <ul> element containing the submission errors...", () => {
        test(`Should not be present in the document if the value of the 'submissionErrors' prop is
         not an array containing at least one string`, async () => {
            renderComponent();
            const submissionErrorsList = screen.queryByRole("list", {
                name: "message submission errors",
            });
            expect(submissionErrorsList).toBeNull();
        });
        test(`Should be present in the document otherwise`, async () => {
            renderComponent({
                ...defaultArgs,
                submissionErrors: ["error_1", "error_2", "error_3"],
            });
            const submissionErrorsList = screen.getByRole("list", {
                name: "message submission errors",
            });
            expect(submissionErrorsList).toBeInTheDocument();
        });
        test(`Should contain as many <li> elements as there are submission errors specified in the
         'submissionErrors' prop`, async () => {
            renderComponent({
                ...defaultArgs,
                submissionErrors: ["error_1", "error_2", "error_3"],
            });
            const submissionErrors = screen.getAllByRole("listitem", {
                name: "message submission error",
            });
            expect(submissionErrors.length).toBe(3);
        });
    });
    describe("Each <li> element displaying a submission error...", () => {
        test(`Should have text content equal to the value of a string in the 'submissionErrors'
         prop, as specified`, async () => {
            renderComponent({
                ...defaultArgs,
                submissionErrors: ["error_1", "error_2", "error_3"],
            });
            expect(screen.getByText("error_1")).toBeInTheDocument();
            expect(screen.getByText("error_2")).toBeInTheDocument();
            expect(screen.getByText("error_3")).toBeInTheDocument();
        });
    });
});
