/* global describe, test, expect */

import formatDate from "./formatDate";

describe("Function Testing...", () => {
    test(`If the argument is 'null', return "Unknown"`, async () => {
        // @ts-expect-error first argument expects string
        expect(formatDate(null)).toBe("Unknown");
    });
    test(`If the argument is not a valid date, return "Unknown"`, async () => {
        // @ts-expect-error first argument expects string
        expect(formatDate(0)).toBe("Unknown");
        // @ts-expect-error first argument expects string
        expect(formatDate({})).toBe("Unknown");
        // @ts-expect-error first argument expects string
        expect(formatDate([])).toBe("Unknown");
        expect(formatDate("")).toBe("Unknown");
    });
    test(`If the argument is a valid date, return the return value of the 'DateTime'
       method in luxon`, async () => {
        expect(formatDate("2000-01-01T01:02:03")).toBe("1/1/2000, 1:02:03 AM");
    });
});
