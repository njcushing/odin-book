/* global describe, test, expect */

import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { BasicTypes } from "@/components/buttons/components/Basic";
import Option, { OptionTypes } from ".";

const mockUser = {
    accountTag: "account_name",
    preferences: { displayName: "Display Name" },
};

const defaultArgs: OptionTypes = {
    user: mockUser,
    onClickHandler: () => {},
};

const renderComponent = (args: OptionTypes = defaultArgs) => {
    return render(<Option user={args.user} onClickHandler={args.onClickHandler} />);
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

describe("UI/DOM Testing...", () => {
    describe("The <li> element...", () => {
        test(`Should contain a <p> element displaying the user's display name`, () => {
            renderComponent();
            const displayName = screen.getByText(mockUser.preferences.displayName);
            expect(displayName).toBeInTheDocument();
        });
        test(`Should contain a <p> element displaying the user's account tag, preceded by the '@'
         symbol`, () => {
            renderComponent();
            const accountTag = screen.getByText(`@${mockUser.accountTag}`);
            expect(accountTag).toBeInTheDocument();
        });
        test(`Should contain a Basic button component`, async () => {
            renderComponent();
            const basic = screen.getByRole("button", { name: "basic button" });
            expect(basic).not.toBeNull();
        });
        test(`That, when clicked, should invoke the 'onClickHandler' callback prop, as specified`, async () => {
            const user = userEvent.setup();
            const callback = vi.fn();

            renderComponent({ ...defaultArgs, onClickHandler: callback });

            const basic = screen.getByRole("button", { name: "basic button" });
            await user.click(basic);

            expect(callback).toHaveBeenCalledTimes(1);
        });
    });
});
