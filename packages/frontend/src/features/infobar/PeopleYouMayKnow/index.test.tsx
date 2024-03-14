/* global describe, test, expect */

import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BasicTypes as ButtonBasicTypes } from "@/components/buttons/components/Basic";
import { OptionTypes } from "@/components/user/components/Option";
import * as mockData from "@/mockData";
import PeopleYouMayKnow from ".";

const renderComponent = () => {
    return render(<PeopleYouMayKnow />);
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

vi.mock("@/components/user", () => ({
    default: {
        Option: ({ user, following, onClickHandler }: OptionTypes) => {
            return (
                <button
                    type="button"
                    aria-label="user option"
                    data-user={user}
                    data-following={following}
                    onClick={(e) => {
                        if (onClickHandler) onClickHandler(e);
                    }}
                ></button>
            );
        },
    },
}));

const mockUsers = mockData.getUsers(3);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockUseAsyncGet = vi.fn(() => [mockUsers, "", () => {}]);
vi.mock("@/hooks/useAsync", async () => {
    const actual = await vi.importActual("@/hooks/useAsync");
    return {
        ...actual,
        GET: () => mockUseAsyncGet(),
    };
});

describe("UI/DOM Testing...", () => {
    describe("The <h3> element displaying the title...", () => {
        test(`Should be present in the document`, () => {
            renderComponent();
            const title = screen.getByRole("heading");
            expect(title).toBeInTheDocument();
        });
    });
    describe("The <li> element containing the Option components...", () => {
        test(`Should have as many children as there are users returned by the useAsync.GET hook`, () => {
            renderComponent();
            const list = screen.getByRole("list");
            expect(list).toBeInTheDocument();
            expect(list.children.length).toBe(3);
        });
    });
    describe("The Basic button component...", () => {
        test(`Should be present in the document`, () => {
            renderComponent();
            const basic = screen.getByRole("button", { name: "basic button" });
            expect(basic).toBeInTheDocument();
        });
    });
});
