/* global describe, test, expect */

import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import * as Types from "../../types";
import Basic from ".";

const defaultArgs: Types.Basic = {
    src: new Uint8Array([]),
    alt: "image alt",
    label: "basic image",
};

const renderComponent = (args = defaultArgs) => {
    return render(<Basic src={args.src} alt={args.alt} label={args.label} />);
};

global.URL.createObjectURL = vi.fn(() => "image");

describe("UI/DOM Testing...", () => {
    describe("The <img> element...", () => {
        test(`Should have a 'alt' attribute with a value equal to the provided
         'alt' prop's value`, () => {
            renderComponent();
            const image: HTMLImageElement = screen.getByRole("img", { name: "basic image" });
            expect(image).toBeInTheDocument();
            expect(image.alt).toBe("image alt");
        });
    });
});
