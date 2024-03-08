/* global describe, test, expect */

import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Label, { LabelTypes } from ".";

const defaultArgs: LabelTypes = {
    labelText: "label",
    fieldId: "fieldId",
    required: false,
};

const renderComponent = (args: LabelTypes = defaultArgs) => {
    return render(
        <Label labelText={args.labelText} fieldId={args.fieldId} required={args.required} />,
    );
};

const mockSizes: React.CSSProperties = {
    fontSize: "1.0rem",
};
const getSizesMock = vi.fn(() => mockSizes);
vi.mock("../../utils/getSizes", () => ({
    default: () => getSizesMock(),
}));

describe("UI/DOM Testing...", () => {
    describe("The <label> element...", () => {
        test(`Should have text content equal to the value of the 'labelText' prop, as specified,
         followed by a colon`, () => {
            renderComponent();
            const label = screen.getByText("label:");
            expect(label).toBeInTheDocument();
        });
        test(`Unless the 'required' prop is set to 'true', in which case it should also be preceded
         by an asterisk`, () => {
            renderComponent({ ...defaultArgs, required: true });
            const label = screen.getByText("*label:");
            expect(label).toBeInTheDocument();
        });
    });
});
