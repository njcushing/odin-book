/* global describe, test, expect */

import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { BasicTypes } from "@/components/buttons/components/Basic";
import { FinderTypes } from "../Finder";
import { User as UserTypes } from "../Finder/utils/findUserFromTag";
import Selector, { SelectorTypes } from ".";

const defaultArgs: SelectorTypes = {
    onChangeHandler: () => {},
};

const renderComponent = (args: SelectorTypes = defaultArgs) => {
    return render(<Selector onChangeHandler={args.onChangeHandler} />);
};

vi.mock("@/components/user", () => ({
    default: {
        Finder: ({ onClickHandler }: FinderTypes) => {
            return (
                <button
                    type="button"
                    aria-label="user finder"
                    onClick={() => {
                        if (onClickHandler) onClickHandler(findUserFromTagMock());
                    }}
                ></button>
            );
        },
    },
}));

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

vi.mock("./components/Option", () => ({
    default: ({ onClickHandler }: BasicTypes) => {
        return (
            <button
                type="button"
                aria-label="option button"
                onClick={(e) => {
                    if (onClickHandler) onClickHandler(e);
                }}
            ></button>
        );
    },
}));

const mockUser = {
    _id: "1",
    accountTag: "JohnSmith84",
    preferences: {
        displayName: "John Smith",
        profileImage: { src: new Uint8Array([]), alt: "" },
    },
};
const findUserFromTagMock = vi.fn((): UserTypes => mockUser);
vi.mock("../Finder/utils/findUserFromTag", () => ({
    default: findUserFromTagMock(),
}));

describe("UI/DOM Testing...", () => {
    describe("The user Finder component...", () => {
        test(`Should be present in the document`, () => {
            renderComponent();
            const finder = screen.getByRole("button", { name: "user finder" });
            expect(finder).toBeInTheDocument();
        });
        test(`Should, when clicked, invoke the 'onChangeHandler' callback prop, as specified`, async () => {
            const user = userEvent.setup();
            const callback = vi.fn();

            renderComponent({ ...defaultArgs, onChangeHandler: callback });

            const finder = screen.getByRole("button", { name: "user finder" });
            await user.click(finder);

            expect(callback).toHaveBeenCalledTimes(1);
        });
    });
    describe("The <ul> element containing the currently-selected users...", () => {
        test(`Should not be present in the document by default`, () => {
            renderComponent();
            const selectedUsers = screen.queryByRole("list");
            expect(selectedUsers).toBeNull();
        });
        test(`Should be present in the document if there is at least one currently-selected user`, async () => {
            const user = userEvent.setup();

            renderComponent();

            const finder = screen.getByRole("button", { name: "user finder" });
            await user.click(finder);

            const selectedUsers = screen.getByRole("list");
            expect(selectedUsers).toBeInTheDocument();
        });
        test(`Should contain as many child Option elements as there are currently-selected users`, async () => {
            const user = userEvent.setup();

            renderComponent();

            const finder = screen.getByRole("button", { name: "user finder" });
            await user.click(finder);

            const selectedUserOptions = screen.getAllByRole("button", { name: "option button" });
            expect(selectedUserOptions.length).toBe(1);
        });
    });
    describe("The <li> element for each currently-selected user...", () => {
        test(`When clicked, should remove the currently-selected user from the list`, async () => {
            const user = userEvent.setup();

            renderComponent();

            const finder = screen.getByRole("button", { name: "user finder" });
            await user.click(finder);

            const selectedUsers = screen.getByRole("list");
            expect(selectedUsers).toBeInTheDocument();

            const selectedUserButton = screen.getByRole("button", { name: "option button" });
            await user.click(selectedUserButton);

            expect(selectedUsers).not.toBeInTheDocument();
        });
        test(`And invoke the 'onChangeHandler' callback prop, as specified`, async () => {
            const user = userEvent.setup();
            const callback = vi.fn();

            renderComponent({ ...defaultArgs, onChangeHandler: callback });

            const finder = screen.getByRole("button", { name: "user finder" });
            await user.click(finder);

            const selectedUsers = screen.getByRole("list");
            expect(selectedUsers).toBeInTheDocument();

            // will have been invoked earlier as a result of adding the user to the list initially
            callback.mockClear();

            const selectedUserButton = screen.getByRole("button", { name: "option button" });
            await user.click(selectedUserButton);

            expect(callback).toHaveBeenCalledTimes(1);
        });
    });
});
