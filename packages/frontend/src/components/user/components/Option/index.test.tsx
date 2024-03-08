/* global describe, test, expect */

import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { BasicTypes } from "@/components/buttons/components/Basic";
import Option, { OptionTypes } from ".";

const defaultArgs: OptionTypes = {
    user: {
        image: { src: new Uint8Array([]), alt: "" },
        displayName: "Display Name",
        accountTag: "account_name",
        disableLinks: false,
    },
    following: false,
    onClickHandler: () => {},
};

const renderComponent = (args: OptionTypes = defaultArgs) => {
    return render(
        <Option user={args.user} following={args.following} onClickHandler={args.onClickHandler} />,
    );
};

vi.mock("@/components/user", () => ({
    default: {
        ImageAndName: () => {
            return <div aria-label="user image and name"></div>;
        },
    },
}));

vi.mock("@/components/buttons", () => ({
    default: {
        Basic: ({ text, symbol, palette, onClickHandler }: BasicTypes) => {
            return (
                <button
                    type="button"
                    aria-label="basic button"
                    onClick={(e) => {
                        if (onClickHandler) onClickHandler(e);
                    }}
                    data-text={text}
                    data-symbol={symbol}
                    data-palette={palette}
                ></button>
            );
        },
    },
}));

describe("UI/DOM Testing...", () => {
    describe("The ImageAndName user component...", () => {
        test(`Should be present in the document`, () => {
            renderComponent();
            const imageAndName = screen.getByRole("generic", { name: "user image and name" });
            expect(imageAndName).toBeInTheDocument();
        });
    });
    describe("The Basic button component...", () => {
        test(`Should be present in the document`, () => {
            renderComponent();
            const basic = screen.getByRole("button", { name: "basic button" });
            expect(basic).toBeInTheDocument();
        });
        test(`Regardless of the value of the 'following' prop`, () => {
            renderComponent({ ...defaultArgs, following: true });
            const basic = screen.getByRole("button", { name: "basic button" });
            expect(basic).toBeInTheDocument();
        });
        test(`Should, when clicked, invoke the 'onClickHandler' callback prop, as specified`, async () => {
            const user = userEvent.setup();
            const callback = vi.fn();

            renderComponent({ ...defaultArgs, onClickHandler: callback });
            const basic = screen.getByRole("button", { name: "basic button" });
            await user.click(basic);

            expect(callback).toHaveBeenCalledTimes(1);
        });
    });
});
