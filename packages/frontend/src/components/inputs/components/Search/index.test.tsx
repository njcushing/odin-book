/* global describe, test, expect */

import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { BasicTypes } from "@/components/buttons/components/Basic";
import Search, { SearchTypes } from ".";

const defaultArgs: SearchTypes = {
    initialValue: "",
    onChangeHandler: null,
    disabled: false,
    readOnly: false,
    placeholder: "",
    onSearchHandler: null,
};

const renderComponent = (args: SearchTypes = defaultArgs) => {
    return render(
        <Search
            initialValue={args.initialValue}
            onChangeHandler={args.onChangeHandler}
            disabled={args.disabled}
            readOnly={args.readOnly}
            placeholder={args.placeholder}
            onSearchHandler={args.onSearchHandler}
        />,
    );
};

vi.mock("@/components/buttons", () => ({
    default: {
        Basic: ({ disabled, onClickHandler }: BasicTypes) => {
            return (
                <button
                    type="button"
                    aria-label="basic button"
                    disabled={disabled}
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
    describe("The <input> element...", () => {
        test(`Should be present in the document`, async () => {
            renderComponent();
            const input = screen.getByRole("textbox", { name: "search bar" });
            expect(input).toBeInTheDocument();
        });
        test(`Should have a default value equal to the value of the 'initialValue' prop, as
         specified`, async () => {
            renderComponent({ ...defaultArgs, initialValue: "text" });
            const input: HTMLInputElement = screen.getByRole("textbox", { name: "search bar" });
            expect(input.value).toBe("text");
        });
        test(`Should have a placeholder equal to the value of the 'placeholder' prop, as specified`, async () => {
            renderComponent({ ...defaultArgs, placeholder: "placeholder" });
            const input: HTMLInputElement = screen.getByRole("textbox", { name: "search bar" });
            expect(input.placeholder).toBe("placeholder");
        });
        test(`On change, should invoke the callback 'onChangeHandler', as specified`, async () => {
            const user = userEvent.setup();
            const callback = vi.fn();

            renderComponent({ ...defaultArgs, onChangeHandler: callback });

            const input = screen.getByRole("textbox", { name: "search bar" });
            await user.type(input, "a");

            expect(callback).toHaveBeenCalledTimes(1);
        });
        test(`Unless the value of the 'disabled' prop is set to 'true'`, async () => {
            const user = userEvent.setup();
            const callback = vi.fn();

            renderComponent({ ...defaultArgs, disabled: true, onChangeHandler: callback });

            const input = screen.getByRole("textbox", { name: "search bar" });
            await user.type(input, "a");

            expect(callback).not.toHaveBeenCalled();
        });
        test(`On change, should not change the value of the <input> element if the value of the
         'readOnly' prop is set to 'true'`, async () => {
            const user = userEvent.setup();

            renderComponent({ ...defaultArgs, readOnly: true });

            const input: HTMLInputElement = screen.getByRole("textbox", { name: "search bar" });
            await user.type(input, "a");

            expect(input.value).toBe("");
        });
    });
    describe("The Basic button component...", () => {
        test(`Should be present in the document`, async () => {
            renderComponent();
            const basic = screen.getByRole("button", { name: "basic button" });
            expect(basic).toBeInTheDocument();
        });
        test(`Should, when clicked, invoke the callback 'onSearchHandler', as specified`, async () => {
            const user = userEvent.setup();
            const callback = vi.fn();

            renderComponent({ ...defaultArgs, onSearchHandler: callback });

            const basic = screen.getByRole("button", { name: "basic button" });
            await user.click(basic);

            expect(callback).toHaveBeenCalledTimes(1);
        });
        test(`Unless the value of the 'disabled' prop is set to 'true'`, async () => {
            const user = userEvent.setup();
            const callback = vi.fn();

            renderComponent({ ...defaultArgs, disabled: true, onSearchHandler: callback });

            const basic = screen.getByRole("button", { name: "basic button" });
            await user.click(basic);

            expect(callback).not.toHaveBeenCalled();
        });
    });
});
