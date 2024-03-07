/* global describe, test, expect */

import { vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import * as Types from "../../types";
import Basic from ".";

const defaultArgs: Types.Basic = {
    type: "button",
    text: "Button Text",
    symbol: "",
    label: "button",
    onClickHandler: () => {},
    disabled: false,
    allowDefaultEventHandling: false,
};

const renderComponent = (args = defaultArgs) => {
    return render(
        <Basic
            type={args.type}
            text={args.text}
            symbol={args.symbol}
            label={args.label}
            onClickHandler={args.onClickHandler}
            disabled={args.disabled}
            allowDefaultEventHandling={args.allowDefaultEventHandling}
        />,
    );
};

describe("UI/DOM Testing...", () => {
    describe("The <button> element...", () => {
        test(`Should be present in the document, with an aria-label equal to the value of the
         'label' prop, as specified`, () => {
            renderComponent();
            const button: HTMLButtonElement = screen.getByRole("button", { name: "button" });
            expect(button).toBeInTheDocument();
        });
        test(`Should have text content equal to the value of the 'text' prop, as specified`, async () => {
            renderComponent();
            const button: HTMLButtonElement = screen.getByRole("button", { name: "button" });
            expect(button.textContent).toBe("Button Text");
        });
        test(`When clicked, should invoke the callback function provided in the 'onClickHandler'
         prop`, async () => {
            const user = userEvent.setup();
            const callback = vi.fn();

            renderComponent({ ...defaultArgs, onClickHandler: callback });
            const button: HTMLButtonElement = screen.getByRole("button", { name: "button" });

            fireEvent.mouseLeave(button);
            await user.click(button);

            expect(callback).toHaveBeenCalled();
        });
        test(`Unless the 'disabled' prop is 'true'`, async () => {
            const user = userEvent.setup();
            const callback = vi.fn();

            renderComponent({ ...defaultArgs, onClickHandler: callback, disabled: true });
            const button: HTMLButtonElement = screen.getByRole("button", { name: "button" });

            await user.click(button);

            expect(callback).not.toHaveBeenCalled();
        });
    });
    describe("The <p> element containing the symbol text...", () => {
        test(`Should only be present in the document if the value of the 'symbol' prop is a string
         with a minimum length of 1 character`, () => {
            renderComponent();
            let symbol = screen.queryByText("symbol");
            expect(symbol).toBeNull();

            renderComponent({ ...defaultArgs, symbol: "symbol" });
            symbol = screen.getByText("symbol");
            expect(symbol).toBeInTheDocument();
        });
    });
});
