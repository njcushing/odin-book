/* global describe, test, expect */

import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { BasicTypes } from "@/components/buttons/components/Basic";
import { SearchTypes } from "@/components/inputs/components/Search";
import Finder, { FinderTypes } from ".";

const defaultArgs: FinderTypes = {
    placeholder: "",
    button: {},
    onClickHandler: () => {},
    clearFindOnClick: false,
};

const renderComponent = (args: FinderTypes = defaultArgs) => {
    return render(
        <Finder
            placeholder={args.placeholder}
            button={args.button}
            onClickHandler={args.onClickHandler}
            clearFindOnClick={args.clearFindOnClick}
        />,
    );
};

vi.mock("./utils/findUserFromTag", () => ({
    default: () => ({
        _id: "1",
        accountTag: "JohnSmith84",
        preferences: {
            displayName: "John Smith",
            profileImage: { src: new Uint8Array([]), alt: "" },
        },
    }),
}));

vi.mock("@/components/inputs", () => ({
    default: {
        Search: ({ onSearchHandler }: SearchTypes) => {
            return (
                <button
                    type="button"
                    aria-label="search bar"
                    onClick={(e) => {
                        if (onSearchHandler) onSearchHandler(e);
                    }}
                ></button>
            );
        },
    },
}));

vi.mock("@/components/user", () => ({
    default: {
        ImageAndName: () => {
            return <div aria-label="user image and name"></div>;
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

describe("UI/DOM Testing...", () => {
    describe("The Search input component...", () => {
        test(`Should be present in the document`, () => {
            renderComponent();
            const search = screen.getByRole("button", { name: "search bar" });
            expect(search).toBeInTheDocument();
        });
    });
    describe("The ImageAndName user component...", () => {
        test(`Should not be present in the document by default`, () => {
            renderComponent();
            const imageAndName = screen.queryByRole("generic", { name: "user image and name" });
            expect(imageAndName).toBeNull();
        });
        test(`Should be present in the document if the search bar's 'onSearchHandler' callback
         prop has been invoked, and a valid user is returned from the 'findUserFromTag' API
         function`, async () => {
            const user = userEvent.setup();

            renderComponent();
            const search = screen.getByRole("button", { name: "search bar" });
            await user.click(search);

            const imageAndName = screen.getByRole("generic", { name: "user image and name" });
            expect(imageAndName).toBeInTheDocument();
        });
    });
    describe("The Basic button component...", () => {
        test(`Should not be present in the document by default`, () => {
            renderComponent();
            const basic = screen.queryByRole("button", { name: "basic button" });
            expect(basic).toBeNull();
        });
        test(`Should be present in the document if the search bar's 'onSearchHandler' callback
         prop has been invoked, and a valid user is returned from the 'findUserFromTag' API
         function`, async () => {
            const user = userEvent.setup();

            renderComponent();
            const search = screen.getByRole("button", { name: "search bar" });
            await user.click(search);

            const basic = screen.getByRole("button", { name: "basic button" });
            expect(basic).toBeInTheDocument();
        });
        test(`When clicked, should invoke the 'onClickHandler' callback prop, as specified`, async () => {
            const user = userEvent.setup();
            const callback = vi.fn();

            renderComponent({ ...defaultArgs, onClickHandler: callback });
            const search = screen.getByRole("button", { name: "search bar" });
            await user.click(search);

            const basic = screen.getByRole("button", { name: "basic button" });
            await user.click(basic);

            expect(callback).toHaveBeenCalledTimes(1);
        });
        test(`When clicked, should set the current user data to null if the 'clearFindOnClick' prop
         is set to 'true'`, async () => {
            const user = userEvent.setup();

            renderComponent({ ...defaultArgs, clearFindOnClick: true });
            const search = screen.getByRole("button", { name: "search bar" });
            await user.click(search);

            const basic = screen.getByRole("button", { name: "basic button" });
            expect(basic).toBeInTheDocument();

            await user.click(basic);

            expect(basic).not.toBeInTheDocument();
        });
    });
});
