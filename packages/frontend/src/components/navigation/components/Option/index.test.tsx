/* global describe, test, expect */

import { vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import NavigationButton from ".";

const renderComponent = (
    text: string = "",
    symbol: string = "",
    onClickHandler = () => {},
    link: string = "",
    style = {},
) => {
    return render(
        <BrowserRouter>
            <NavigationButton
                text={text}
                symbol={symbol}
                onClickHandler={onClickHandler}
                link={link}
                style={style}
            />
        </BrowserRouter>,
    );
};

describe("UI/DOM Testing...", () => {
    describe("The Link element...", () => {
        test(`Should be present in the document`, () => {
            renderComponent();
            const link = screen.getByRole("link", { name: "navigation-option" });
            expect(link).toBeInTheDocument();
        });
        test(`When clicked, should invoke the provided callback function`, async () => {
            const user = userEvent.setup();
            const callback = vi.fn();

            renderComponent("test", "symbol", callback);
            const link = screen.getByRole("link", { name: "navigation-option" });

            await user.click(link);
            fireEvent.mouseLeave(link);

            expect(callback).toHaveBeenCalled();
        });
    });
    describe("The paragraph element for the text...", () => {
        test(`Should be present in the document only if the supplied 'text' prop has a string
         value with length greater than 0`, () => {
            renderComponent("test");
            const text = screen.getByText("test");
            expect(text).toBeInTheDocument();
        });
        test(`Should not be present in the document otherwise`, () => {
            renderComponent();
            const text = screen.queryByText("test");
            expect(text).toBeNull();
        });
    });
    describe("The paragraph element for the symbol...", () => {
        test(`Should be present in the document only if the supplied 'symbol' prop has a string
         value with length greater than 0`, () => {
            renderComponent("test", "symbol");
            const symbol = screen.getByText("symbol");
            expect(symbol).toBeInTheDocument();
        });
        test(`Should not be present in the document otherwise`, () => {
            renderComponent("test");
            const symbol = screen.queryByText("symbol");
            expect(symbol).toBeNull();
        });
    });
});