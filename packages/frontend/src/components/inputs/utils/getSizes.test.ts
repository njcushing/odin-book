/* global describe, test, expect */

import getSizes from "./getSizes";

describe("Function Testing...", () => {
    test(`For each size, the function should return an object containing CSS style rules`, () => {
        expect(getSizes("xs", "label")).toBeInstanceOf(Object);
        expect(getSizes("s", "label")).toBeInstanceOf(Object);
        expect(getSizes("m", "label")).toBeInstanceOf(Object);
        expect(getSizes("l", "label")).toBeInstanceOf(Object);
        expect(getSizes("xl", "label")).toBeInstanceOf(Object);
    });
});
