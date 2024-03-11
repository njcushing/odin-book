/* global describe, test, expect */

import formatNumber from "./formatNumber";

describe("Function Testing...", () => {
    test(`Providing a value that is not a valid number for the value should return "0"`, () => {
        // @ts-expect-error first argument expects number
        const result = formatNumber(null, 0);
        expect(result).toBe("0");
    });
    test(`Providing the arguments 471 and 0 should return "471"`, () => {
        const result = formatNumber(471, 0);
        expect(result).toBe("471");
    });
    test(`Providing the arguments 9819231 and 1 should return "9.8M"`, () => {
        const result = formatNumber(9819231, 1);
        expect(result).toBe("9.8M");
    });
    test(`Providing the arguments 223098302358902 and 3 should return "2.231Qa"`, () => {
        const result = formatNumber(223098302358902, 3);
        expect(result).toBe("223.098T");
    });
    test(`Providing the arguments 304 and -1 should return "304"`, () => {
        const result = formatNumber(304, -1);
        expect(result).toBe("304");
    });
});
