/* global describe, test, expect */

import { vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { UploadTypes } from "@/components/buttons/components/Upload";
import { LabelTypes } from "../Label";
import { DescriptionTypes } from "../Description";
import { ErrorTypes } from "../Error";
import { FileButtonTypes } from "../FileButton";
import FileComponent, { FileTypes } from ".";
import { ReturnTypes as ValidateUploadedFileReturnTypes } from "./utils/validateUploadedFile";
import * as validation from "../../utils/validation";

const defaultArgs: FileTypes = {
    labelText: "label",
    fieldId: "fieldId",
    fieldName: "fieldName",
    initialValue: {},
    disabled: false,
    required: false,
    errorMessage: "",
    validator: null,
    size: "s",
    accept: "image.*",
    multiple: false,
    maximumAmount: undefined,
    description: "",
    buttonSymbol: "attach_file",
    onUpdateHandler: null,
    displayNoFilesSelectedMessage: false,
};

const renderComponent = (args: FileTypes = defaultArgs) => {
    return render(
        <FileComponent
            labelText={args.labelText}
            fieldId={args.fieldId}
            fieldName={args.fieldName}
            initialValue={args.initialValue}
            disabled={args.disabled}
            required={args.required}
            errorMessage={args.errorMessage}
            validator={args.validator}
            size={args.size}
            accept={args.accept}
            multiple={args.multiple}
            maximumAmount={args.maximumAmount}
            description={args.description}
            buttonSymbol={args.buttonSymbol}
            onUpdateHandler={args.onUpdateHandler}
            displayNoFilesSelectedMessage={args.displayNoFilesSelectedMessage}
        />,
    );
};

const mockUploads: [ProgressEvent<FileReader>, File][] = [
    [
        new ProgressEvent("progress") as ProgressEvent<FileReader>,
        new File(["data"], "file_1.png", {
            type: "image/png",
        }),
    ],
    [
        new ProgressEvent("progress") as ProgressEvent<FileReader>,
        new File(["data"], "file_2.png", {
            type: "image/png",
        }),
    ],
    [
        new ProgressEvent("progress") as ProgressEvent<FileReader>,
        new File(["data"], "file_3.png", {
            type: "image/png",
        }),
    ],
];

vi.mock("@/components/buttons", () => ({
    default: {
        Upload: ({
            fieldId,
            fieldName,
            accept,
            multiple,
            disabled,
            onUploadHandler,
        }: UploadTypes) => {
            return (
                <input
                    type="file"
                    aria-label="upload button input"
                    id={fieldId}
                    name={fieldName}
                    accept={accept}
                    multiple={multiple}
                    disabled={disabled}
                    onChange={() => {
                        if (!disabled && onUploadHandler) onUploadHandler(mockUploads);
                    }}
                ></input>
            );
        },
    },
}));

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
        FileButton: ({ file, onClickHandler }: FileButtonTypes) => {
            return (
                <button
                    type="button"
                    aria-label="input field file button"
                    onClick={(e) => {
                        if (onClickHandler) onClickHandler(e);
                    }}
                    data-file={file}
                >
                    {file.name}
                </button>
            );
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

const mockFiles = [
    {
        data: new Uint8Array([]),
        file: new File(["data"], "file_1.png", {
            type: "image/png",
        }),
    },
    {
        data: new Uint8Array([]),
        file: new File(["data"], "file_2.png", {
            type: "image/png",
        }),
    },
    {
        data: new Uint8Array([]),
        file: new File(["data"], "file_3.png", {
            type: "image/png",
        }),
    },
];
const mockValidateUploadedFile = vi.fn(
    (): ValidateUploadedFileReturnTypes => [true, "Valid field.", mockFiles[0]],
);
vi.mock("./utils/validateUploadedFile", () => ({
    default: () => mockValidateUploadedFile(),
}));

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
    describe("The Upload button component...", () => {
        test(`Should be present in the document`, async () => {
            renderComponent();
            const upload = screen.getByLabelText("upload button input");
            expect(upload).toBeInTheDocument();
        });
        test(`Should have an 'id' attribute with value equal to the value of the 'fieldId' prop, as
         specified`, async () => {
            renderComponent();
            const upload = screen.getByLabelText("upload button input");
            expect(upload.getAttribute("id")).toBe(defaultArgs.fieldId);
        });
        test(`Should have a 'name' attribute with value equal to the value of the 'fieldName' prop,
         as specified`, async () => {
            renderComponent();
            const upload = screen.getByLabelText("upload button input");
            expect(upload.getAttribute("name")).toBe(defaultArgs.fieldName);
        });
        test(`Should have an 'accept' attribute with value equal to the value of the 'accept' prop,
         as specified`, async () => {
            renderComponent();
            const upload = screen.getByLabelText("upload button input");
            expect(upload.getAttribute("accept")).toBe(defaultArgs.accept);
        });
        test(`Should have a 'multiple' attribute with value equal to the value of the 'multiple'
         prop, as specified`, async () => {
            renderComponent();
            const upload: HTMLInputElement = screen.getByLabelText("upload button input");
            expect(upload.multiple).toBe(defaultArgs.multiple);
        });
        test(`On change, should invoke the callback 'onUpdateHandler' prop, as specified`, async () => {
            const callback = vi.fn();

            renderComponent({ ...defaultArgs, onUpdateHandler: callback });

            const upload = screen.getByLabelText("upload button input");
            /*
             *  Uploaded value won't matter as we have mocked the return value of the
             *  'onChangeHandler' passed to the File component
             */
            await waitFor(() =>
                fireEvent.change(upload, {
                    target: { files: [] },
                }),
            );

            expect(callback).toHaveBeenCalled();
        });
        test(`Unless the value of the 'disabled' prop is set to 'true'`, async () => {
            const callback = vi.fn();

            renderComponent({ ...defaultArgs, disabled: true, onUpdateHandler: callback });

            const upload = screen.getByLabelText("upload button input");
            await waitFor(() =>
                fireEvent.change(upload, {
                    target: { files: [] },
                }),
            );

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
    describe("The FileButton component(s)...", () => {
        test(`Should be present in the document in the same quantity as there are files uploaded`, async () => {
            renderComponent();

            const upload = screen.getByLabelText("upload button input");
            await waitFor(() =>
                fireEvent.change(upload, {
                    target: { files: [] },
                }),
            );

            const fileButtons = screen.getAllByRole("button", { name: "input field file button" });
            expect(fileButtons.length).toBe(3);
        });
        test(`Should, when clicked, remove the given file from the uploaded files`, async () => {
            mockValidateUploadedFile.mockReturnValueOnce([true, "Valid field.", mockFiles[0]]);
            mockValidateUploadedFile.mockReturnValueOnce([true, "Valid field.", mockFiles[1]]);
            mockValidateUploadedFile.mockReturnValueOnce([true, "Valid field.", mockFiles[2]]);

            const user = userEvent.setup();
            renderComponent();

            const upload = screen.getByLabelText("upload button input");
            await waitFor(() =>
                fireEvent.change(upload, {
                    target: { files: [] },
                }),
            );

            const fileButton1 = screen.getByText("file_1.png");
            const fileButton2 = screen.getByText("file_2.png");
            const fileButton3 = screen.getByText("file_3.png");

            expect(fileButton1).toBeInTheDocument();
            expect(fileButton2).toBeInTheDocument();
            expect(fileButton3).toBeInTheDocument();

            await user.click(fileButton2);

            expect(fileButton1).toBeInTheDocument();
            expect(fileButton2).not.toBeInTheDocument();
            expect(fileButton3).toBeInTheDocument();
        });
        test(`Should, when clicked, invoke the callback 'onUpdateHandler' prop, as specified`, async () => {
            mockValidateUploadedFile.mockReturnValueOnce([true, "Valid field.", mockFiles[0]]);
            mockValidateUploadedFile.mockReturnValueOnce([true, "Valid field.", mockFiles[1]]);
            mockValidateUploadedFile.mockReturnValueOnce([true, "Valid field.", mockFiles[2]]);

            const user = userEvent.setup();
            const callback = vi.fn();
            renderComponent({ ...defaultArgs, onUpdateHandler: callback });

            const upload = screen.getByLabelText("upload button input");
            await waitFor(() =>
                fireEvent.change(upload, {
                    target: { files: [] },
                }),
            );

            const fileButton1 = screen.getByText("file_1.png");
            const fileButton2 = screen.getByText("file_2.png");
            const fileButton3 = screen.getByText("file_3.png");

            expect(fileButton1).toBeInTheDocument();
            expect(fileButton2).toBeInTheDocument();
            expect(fileButton3).toBeInTheDocument();

            await user.click(fileButton2);

            expect(callback).toHaveBeenCalled();
        });
    });
    describe("The <p> element displaying the 'No files selected.' string...", () => {
        test(`Should not be present in the document if the value of the
         'displayNoFilesSelectedMessage' prop is set to 'false' (or is not set at all)`, async () => {
            renderComponent();
            const noFilesSelected = screen.queryByText("No files selected.");
            expect(noFilesSelected).toBeNull();
        });
        test(`Or if the value of the 'displayNoFilesSelectedMessage' prop is set to 'true', but
         there is at least one uploaded file`, async () => {
            renderComponent({ ...defaultArgs, displayNoFilesSelectedMessage: true });

            const upload = screen.getByLabelText("upload button input");
            await waitFor(() =>
                fireEvent.change(upload, {
                    target: { files: [] },
                }),
            );

            const noFilesSelected = screen.queryByText("No files selected.");
            expect(noFilesSelected).toBeNull();
        });
        test(`Otherwise, it should be present in the document`, async () => {
            renderComponent({ ...defaultArgs, displayNoFilesSelectedMessage: true });
            const noFilesSelected = screen.getByText("No files selected.");
            expect(noFilesSelected).toBeInTheDocument();
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
         validateUploadedFile function, to its 'text' prop, if the file validation fails on change
         of the input's value`, async () => {
            mockValidateUploadedFile.mockReturnValueOnce([false, "Invalid file.", null]);

            renderComponent();

            const upload = screen.getByLabelText("upload button input");
            await waitFor(() =>
                fireEvent.change(upload, {
                    target: { files: [] },
                }),
            );

            const error = screen.getByRole("generic", { name: "input field error" });
            expect(error.textContent).toBe("Invalid file.");
        });
    });
});
describe("Other Functionality Testing...", () => {
    describe("If the value of the 'maximumAmount' prop is a number...", () => {
        test(`When files are uploaded, any that exceed the maximum amount should not be added
         to the uploaded files`, async () => {
            renderComponent({ ...defaultArgs, maximumAmount: 1 });

            const upload = screen.getByLabelText("upload button input");
            await waitFor(() =>
                fireEvent.change(upload, {
                    target: { files: [] },
                }),
            );

            const fileButtons = screen.getAllByRole("button", { name: "input field file button" });
            expect(fileButtons.length).toBe(1);
        });
    });
});
