/* global describe, test, expect */

import { vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import React from "react";
import Horizontal, { HorizontalTypes } from ".";
import { OptionTypes } from "./components/Option";

const defaultArgs: HorizontalTypes = {
    options: [],
    selected: null,
    label: "navigation menu",
    onSelectHandler: null,
};

const renderComponent = (args: HorizontalTypes = defaultArgs) => {
    return render(
        <Horizontal
            options={args.options}
            selected={args.selected}
            label={args.label}
            onSelectHandler={args.onSelectHandler}
        />,
    );
};

vi.mock("./components/Option", () => ({
    default: ({ text, link, onClickHandler }: OptionTypes) => {
        return (
            <a
                href={link}
                onClick={(e) => {
                    if (onClickHandler) onClickHandler(e);
                }}
            >
                {text}
            </a>
        );
    },
}));

describe("UI/DOM Testing...", () => {
    describe("The <nav> element...", () => {
        test(`Should be present in the document, with an aria-label equal to the value of the
         'label' prop, as specified`, () => {
            renderComponent();
            const nav = screen.getByLabelText("navigation menu");
            expect(nav).toBeInTheDocument();
        });
        test(`Should have as many children as options provided in the 'options' prop (0)`, () => {
            renderComponent();
            const nav = screen.getByLabelText("navigation menu");
            expect(nav.children.length).toBe(0);
        });
        test(`Should have as many children as options provided in the 'options' prop (3)`, () => {
            renderComponent({
                ...defaultArgs,
                options: [{ text: "option_1" }, { text: "option_2" }, { text: "option_3" }],
            });
            const nav = screen.getByLabelText("navigation menu");
            expect(nav.children.length).toBe(3);
        });
    });
    describe("The Option components...", () => {
        test(`Should have text content equal to the value of the 'text' prop within the option's
         props, as specified, as long as the value of the 'type' prop is 'wide'`, async () => {
            const user = userEvent.setup();
            const callback = vi.fn();

            renderComponent({
                ...defaultArgs,
                options: [{ text: "option_1" }, { text: "option_2" }, { text: "option_3" }],
                onSelectHandler: callback,
            });
            const link = screen.getByText("option_1");

            fireEvent.mouseLeave(link);
            await user.click(link);

            expect(callback).toHaveBeenCalled();
        });
    });
});
