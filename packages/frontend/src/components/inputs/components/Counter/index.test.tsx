/* global describe, test, expect */

import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Counter, { CounterTypes } from ".";

const defaultArgs: CounterTypes = {
    count: 0,
    maxLength: 100,
};

const renderComponent = (args: CounterTypes = defaultArgs) => {
    return render(<Counter count={args.count} maxLength={args.maxLength} />);
};

const mockSizes: React.CSSProperties = {
    fontSize: "1.0rem",
};
const getSizesMock = vi.fn(() => mockSizes);
vi.mock("../../utils/getSizes", () => ({
    default: () => getSizesMock(),
}));

describe("UI/DOM Testing...", () => {
    describe("The <p> element...", () => {
        test(`Should have text content equal to the value of the 'count' prop, as specified,
         followed by a forward-slash, followed by the value of the 'maxLength' prop, as specified`, () => {
            renderComponent();
            const counter = screen.getByText(`${defaultArgs.count}/${defaultArgs.maxLength}`);
            expect(counter).toBeInTheDocument();
        });
        test(`Unless the value of the 'maxLength' prop is not a valid number, in which case it
         should only be the value of the 'count' prop, as specified`, () => {
            renderComponent({ ...defaultArgs, maxLength: undefined });
            const counter = screen.getByText(defaultArgs.count);
            expect(counter).toBeInTheDocument();
        });
    });
});
