/* global describe, test, expect */

import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BasicTypes } from "@/components/buttons/components/Basic";
import FileButton, { FileButtonTypes } from ".";

const defaultArgs: FileButtonTypes = {
    file: new File(["example"], "example.png", { type: "image/png" }),
    label: "label",
    onClickHandler: () => {},
};

const renderComponent = (args: FileButtonTypes = defaultArgs) => {
    return render(
        <FileButton file={args.file} label={args.label} onClickHandler={args.onClickHandler} />,
    );
};

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

const mockSizes: React.CSSProperties = {
    fontSize: "1.0rem",
};
const getSizesMock = vi.fn(() => mockSizes);
vi.mock("../../utils/getSizes", () => ({
    default: () => getSizesMock(),
}));

const formatBytesMock = vi.fn(() => "bytes");
vi.mock("@/utils/formatBytes", () => ({
    default: () => formatBytesMock(),
}));

describe("UI/DOM Testing...", () => {
    describe("The <p> element containing the file name...", () => {
        test(`Should have text content equal to the value of the 'name' property on the 'file' prop,
         as specified`, () => {
            renderComponent();
            const fileName = screen.getByText(defaultArgs.file.name);
            expect(fileName).toBeInTheDocument();
        });
    });
    describe("The <p> element containing the file size...", () => {
        test(`Should have text content equal to the return value of the 'formatBytes' utility
         function, when the value of the 'name' property on the 'file' prop, as specified, is passed
         as an argument`, () => {
            renderComponent();
            const fileSize = screen.getByText("bytes");
            expect(fileSize).toBeInTheDocument();
        });
    });
});
