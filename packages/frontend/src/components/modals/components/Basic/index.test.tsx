/* global describe, test, expect */

import { vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { BasicTypes as ButtonBasicTypes } from "@/components/buttons/components/Basic";
import Basic, { BasicTypes } from ".";

const defaultArgs: BasicTypes = {
    onCloseClickHandler: null,
    unblockPointerEvents: false,
};

const renderComponent = (args = defaultArgs) => {
    return render(
        <Basic
            onCloseClickHandler={args.onCloseClickHandler}
            unblockPointerEvents={args.unblockPointerEvents}
        />,
    );
};

vi.mock("@/components/buttons", () => ({
    default: {
        Basic: ({ onClickHandler }: ButtonBasicTypes) => {
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
    describe("The Basic button component...", () => {
        test(`Should be present in the document`, () => {
            renderComponent();
            const button: HTMLButtonElement = screen.getByRole("button", { name: "basic button" });
            expect(button).toBeInTheDocument();
        });
        test(`When clicked, should invoke the callback function provided in the
         'onCloseClickHandler' prop`, async () => {
            const user = userEvent.setup();
            const callback = vi.fn();

            renderComponent({ ...defaultArgs, onCloseClickHandler: callback });
            const button: HTMLButtonElement = screen.getByRole("button", { name: "basic button" });

            fireEvent.mouseLeave(button);
            await user.click(button);

            expect(callback).toHaveBeenCalled();
        });
    });
});
