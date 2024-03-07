/* global describe, test, expect */

import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import * as Types from "../../types";
import Profile from ".";

const defaultArgs: Types.Profile = {
    src: new Uint8Array([]),
    alt: "image alt",
    label: "profile image",
    status: null,
    sizePx: 50,
};

const renderComponent = (args = defaultArgs) => {
    return render(
        <Profile
            src={args.src}
            alt={args.alt}
            label={args.label}
            status={args.status}
            sizePx={args.sizePx}
        />,
    );
};

global.URL.createObjectURL = vi.fn(() => "image");

describe("UI/DOM Testing...", () => {
    describe("The <img> element...", () => {
        test(`Should have a 'alt' attribute with a value equal to the provided
         'alt' prop's value`, () => {
            renderComponent();
            const image: HTMLImageElement = screen.getByRole("img", { name: "profile image" });
            expect(image).toBeInTheDocument();
            expect(image.alt).toBe("image alt");
        });
    });
    describe("The status indicator...", () => {
        test(`Should be present in the document if the value provided to the
         'status' prop is not equal to 'null'`, () => {
            renderComponent({ ...defaultArgs, status: "online" });
            const statusIndicator = screen.getByRole("generic", { name: "status-indicator" });
            expect(statusIndicator).toBeInTheDocument();
        });
        test(`Should not be present in the document if the value provided to the
         'status' prop is equal to 'null'`, () => {
            renderComponent();
            const statusIndicator = screen.queryByRole("generic", { name: "status-indicator" });
            expect(statusIndicator).toBeNull();
        });
    });
});
