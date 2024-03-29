/* global describe, test, expect */

import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Menu, { MenuTypes } from ".";
import { OptionTypes } from "./components/Option";

const defaultArgs: MenuTypes = {
    type: "wide",
    label: "navigation menu",
    options: [],
};

const renderComponent = (args: MenuTypes = defaultArgs) => {
    return render(<Menu type={args.type} label={args.label} options={args.options} />);
};

vi.mock("./components/Option", () => ({
    default: ({ text }: OptionTypes) => {
        return <div>{text}</div>;
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
         props, as specified, as long as the value of the 'type' prop is 'wide'`, () => {
            renderComponent({
                ...defaultArgs,
                options: [{ text: "option_1" }, { text: "option_2" }, { text: "option_3" }],
            });
            const nav = screen.getByLabelText("navigation menu");
            expect(nav.children[0].textContent).toBe("option_1");
        });
        test(`Should have no text content if the value of the 'type' prop is 'thin'`, () => {
            renderComponent({
                ...defaultArgs,
                type: "thin",
                options: [{ text: "option_1" }, { text: "option_2" }, { text: "option_3" }],
            });
            const nav = screen.getByLabelText("navigation menu");
            expect(nav.children[0].textContent).toBe("");
        });
    });
});
