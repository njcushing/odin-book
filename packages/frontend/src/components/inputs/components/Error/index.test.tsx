/* global describe, test, expect */

import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Error, { ErrorTypes } from ".";

const defaultArgs: ErrorTypes = {
    text: "description",
};

const renderComponent = (args: ErrorTypes = defaultArgs) => {
    return render(<Error text={args.text} />);
};

const mockSizes: React.CSSProperties = {
    fontSize: "1.0rem",
};
const getSizesMock = vi.fn(() => mockSizes);
vi.mock("../../utils/getSizes", () => ({
    default: () => getSizesMock(),
}));

describe("UI/DOM Testing...", () => {
    describe("The heading element...", () => {
        test(`Should be present in the document`, () => {
            renderComponent();
            const error = screen.getByRole("heading", { name: "input field error" });
            expect(error).toBeInTheDocument();
        });
        test(`Unless the value of the 'text' prop, as specified, is not a string with a length of
         at least 1 character`, () => {
            renderComponent({ text: "" });
            const error = screen.queryByRole("heading", { name: "input field error" });
            expect(error).toBeNull();
        });
        test(`Should have text content equal to the value of the 'text' prop, as specified,
         followed by a colon`, () => {
            renderComponent();
            const error = screen.getByRole("heading", { name: "input field error" });
            expect(error.textContent).toBe(defaultArgs.text);
        });
    });
});
