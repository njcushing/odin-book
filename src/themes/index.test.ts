/* global describe, test, expect */

import "@testing-library/jest-dom";
import * as themes from ".";

describe("'optionNames' method...", () => {
    test("Should return an array of strings containing the names for each option", () => {
        const names = themes.optionNames();
        expect(Array.isArray(names)).toBeTruthy();
    });
});
describe("'setTheme' method...", () => {
    test("The 'theme' attribute on the :root DOM element should have its value set to the value of the argument provided", () => {
        const root = document.querySelector(":root");
        if (root === null) {
            throw new Error("Tried to query root object; got 'null'.");
        }
        themes.setTheme("dark");
        expect(root.getAttribute("theme")).toBe("dark");
        themes.setTheme("light");
        expect(root.getAttribute("theme")).toBe("light");
        themes.setTheme("default");
        expect(root.getAttribute("theme")).toBe("default");
    });
    test("But only if that value is present in the array of names returned by the 'optionNames' method", () => {
        const root = document.querySelector(":root");
        if (root === null) {
            throw new Error("Tried to query root object; got 'null'.");
        }
        themes.setTheme("dark");
        expect(root.getAttribute("theme")).toBe("dark");
        themes.setTheme("light");
        expect(root.getAttribute("theme")).toBe("light");
        themes.setTheme("thisIsNotARealTheme");
        expect(root.getAttribute("theme")).toBe("light");
    });
});
