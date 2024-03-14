/* global describe, test, expect */

import { vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ImageAndName, { ImageAndNameTypes } from ".";

const assignMock = vi.fn();
window.location = { ...window.location, assign: assignMock };
window.location.href = "/";
afterEach(() => {
    assignMock.mockClear();
    window.location.href = "/";
});

const defaultArgs: ImageAndNameTypes = {
    image: { src: new Uint8Array([]), alt: "" },
    displayName: "Display Name",
    accountTag: "account_name",
    disableLinks: false,
    size: "m",
};

const renderComponent = (args: ImageAndNameTypes = defaultArgs) => {
    return render(
        <ImageAndName
            image={args.image}
            displayName={args.displayName}
            accountTag={args.accountTag}
            disableLinks={args.disableLinks}
            size={args.size}
        />,
    );
};

vi.mock("@/components/images", () => ({
    default: {
        Profile: () => {
            return <div aria-label="profile image"></div>;
        },
    },
}));

describe("UI/DOM Testing...", () => {
    describe("The Profile image component...", () => {
        test(`Should be present in the document`, () => {
            renderComponent();
            const profile = screen.getByRole("generic", { name: "profile image" });
            expect(profile).toBeInTheDocument();
        });
    });
    describe("The <button> element displaying the user's display name...", () => {
        test(`Should be present in the document`, () => {
            renderComponent();
            const displayName = screen.getByRole("button", { name: "display name" });
            expect(displayName).toBeInTheDocument();
        });
        test(`Unless the value of the 'displayName' prop is not a string with a minimum length of
         1 character, as specified`, () => {
            renderComponent({ ...defaultArgs, displayName: "" });
            const displayName = screen.queryByRole("button", { name: "display name" });
            expect(displayName).toBeNull();
        });
        test(`Should have text content equal to that of the value of the 'displayName' prop, as
         specified`, () => {
            renderComponent();
            const displayName = screen.getByRole("button", { name: "display name" });
            expect(displayName.textContent).toBe(defaultArgs.displayName);
        });
        test(`Should, when clicked, redirect the user to that user's account page, the location of
         which is the account tag, as specified as the value of the 'accountTag' prop`, async () => {
            const user = userEvent.setup();

            renderComponent();
            const displayName = screen.getByRole("button", { name: "display name" });
            fireEvent.mouseLeave(displayName);
            await user.click(displayName);

            expect(window.location.href).toBe("/user/account_name");
        });
        test(`Unless the 'disableLinks' prop is set to true`, async () => {
            const user = userEvent.setup();

            renderComponent({ ...defaultArgs, disableLinks: true });
            const displayName = screen.getByRole("button", { name: "display name" });
            await user.click(displayName);

            expect(window.location.href).toBe("/");
        });
    });
    describe("The <button> element displaying the user's account tag...", () => {
        test(`Should be present in the document`, () => {
            renderComponent();
            const accountTag = screen.getByRole("button", { name: "account tag" });
            expect(accountTag).toBeInTheDocument();
        });
        test(`Unless the value of the 'displayName' prop is not a string with a minimum length of
         1 character, as specified`, () => {
            renderComponent({ ...defaultArgs, displayName: "" });
            const accountTag = screen.queryByRole("button", { name: "account tag" });
            expect(accountTag).toBeNull();
        });
        test(`Should have text content equal to that of the value of the 'displayName' prop, as
         specified, preceded by an '@' symbol`, () => {
            renderComponent();
            const accountTag = screen.getByRole("button", { name: "account tag" });
            expect(accountTag.textContent).toBe(`@${defaultArgs.accountTag}`);
        });
        test(`Should, when clicked, redirect the user to that user's account page, the location of
         which is the account tag, as specified as the value of the 'accountTag' prop`, async () => {
            const user = userEvent.setup();

            renderComponent();
            const accountTag = screen.getByRole("button", { name: "account tag" });
            fireEvent.mouseLeave(accountTag);
            await user.click(accountTag);

            expect(window.location.href).toBe("/user/account_name");
        });
        test(`Unless the 'disableLinks' prop is set to true`, async () => {
            const user = userEvent.setup();

            renderComponent({ ...defaultArgs, disableLinks: true });
            const accountTag = screen.getByRole("button", { name: "account tag" });
            await user.click(accountTag);

            expect(window.location.href).toBe("/");
        });
    });
    describe("The 'size' prop...", () => {
        describe(`Should have no effect on the rendering of the other elements, only their styles`, () => {
            test(`When its value is "xs"`, () => {
                renderComponent({ ...defaultArgs, size: "xs" });
                const profile = screen.getByRole("generic", { name: "profile image" });
                const displayName = screen.getByRole("button", { name: "display name" });
                const accountTag = screen.getByRole("button", { name: "account tag" });
                expect(profile).toBeInTheDocument();
                expect(displayName).toBeInTheDocument();
                expect(accountTag).toBeInTheDocument();
            });
            test(`When its value is "s"`, () => {
                renderComponent({ ...defaultArgs, size: "s" });
                const profile = screen.getByRole("generic", { name: "profile image" });
                const displayName = screen.getByRole("button", { name: "display name" });
                const accountTag = screen.getByRole("button", { name: "account tag" });
                expect(profile).toBeInTheDocument();
                expect(displayName).toBeInTheDocument();
                expect(accountTag).toBeInTheDocument();
            });
            test(`When its value is "m"`, () => {
                renderComponent({ ...defaultArgs, size: "m" });
                const profile = screen.getByRole("generic", { name: "profile image" });
                const displayName = screen.getByRole("button", { name: "display name" });
                const accountTag = screen.getByRole("button", { name: "account tag" });
                expect(profile).toBeInTheDocument();
                expect(displayName).toBeInTheDocument();
                expect(accountTag).toBeInTheDocument();
            });
            test(`When its value is "l"`, () => {
                renderComponent({ ...defaultArgs, size: "l" });
                const profile = screen.getByRole("generic", { name: "profile image" });
                const displayName = screen.getByRole("button", { name: "display name" });
                const accountTag = screen.getByRole("button", { name: "account tag" });
                expect(profile).toBeInTheDocument();
                expect(displayName).toBeInTheDocument();
                expect(accountTag).toBeInTheDocument();
            });
            test(`When its value is "xl"`, () => {
                renderComponent({ ...defaultArgs, size: "xl" });
                const profile = screen.getByRole("generic", { name: "profile image" });
                const displayName = screen.getByRole("button", { name: "display name" });
                const accountTag = screen.getByRole("button", { name: "account tag" });
                expect(profile).toBeInTheDocument();
                expect(displayName).toBeInTheDocument();
                expect(accountTag).toBeInTheDocument();
            });
        });
    });
});
