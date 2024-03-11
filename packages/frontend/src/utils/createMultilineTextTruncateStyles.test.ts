/* global describe, test, expect */

import createMultilineTextTruncateStyles from "./createMultilineTextTruncateStyles";

describe("Function Testing...", () => {
    test(`The function should return the correct style rules with respect to the line count provided
       as an argument`, () => {
        expect(createMultilineTextTruncateStyles(0)).toStrictEqual({
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            WebkitLineClamp: 0,
        });
        expect(createMultilineTextTruncateStyles(1)).toStrictEqual({
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            WebkitLineClamp: 1,
        });
        expect(createMultilineTextTruncateStyles(2)).toStrictEqual({
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            WebkitLineClamp: 2,
        });
        expect(createMultilineTextTruncateStyles(3)).toStrictEqual({
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            WebkitLineClamp: 3,
        });
    });
});
