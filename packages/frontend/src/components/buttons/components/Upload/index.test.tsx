/* global describe, test, expect */

import { vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import Upload, { UploadTypes } from ".";

const defaultArgs: UploadTypes = {
    labelText: "label",
    fieldId: "fieldId",
    fieldName: "fieldName",
    accept: "*",
    multiple: false,
    onUploadHandler: () => {},
};

const renderComponent = (args = defaultArgs) => {
    return render(
        <Upload
            labelText={args.labelText}
            fieldId={args.fieldId}
            fieldName={args.fieldName}
            accept={args.accept}
            multiple={args.multiple}
            onUploadHandler={args.onUploadHandler}
        />,
    );
};

type Children = { children: React.ReactNode };

vi.mock("@/components/buttons/components/Basic", () => ({
    default: ({ children }: Children) => {
        return children;
    },
}));

describe("UI/DOM Testing...", () => {
    describe("The <input> element...", () => {
        test(`Should be present in the document, with an implicit label with text content equal to
         the value of the 'labelText' prop, as specified`, () => {
            renderComponent();
            const input = screen.getByLabelText("label");
            expect(input).toBeInTheDocument();
        });
        test(`Should, when files are uploaded, invoke the callback function provided in the
         'onUploadHandler' prop`, async () => {
            const callback = vi.fn();

            renderComponent({ ...defaultArgs, onUploadHandler: callback });
            const input = screen.getByLabelText("label");

            const file = new File(["example"], "example.png", { type: "image/png" });
            fireEvent.change(input, { target: { files: [file] } });

            await waitFor(() => {
                expect(callback).toHaveBeenCalled(); // Assert that callback has been called
            });
        });
    });
});
