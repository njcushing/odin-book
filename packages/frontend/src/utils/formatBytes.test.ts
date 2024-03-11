/* global describe, test, expect */

import formatBytes from "./formatBytes";

describe("Function Testing...", () => {
    test(`Providing a value that is not a valid number for the number of bytes should return "0
       Bytes"`, () => {
        // @ts-expect-error first argument expects number
        const result = formatBytes(null, 0);
        expect(result).toBe("0 Bytes");
    });
    test(`Providing the arguments 234 and 0 should return "234 Bytes"`, () => {
        const result = formatBytes(234, 0);
        expect(result).toBe("234 Bytes");
    });
    test(`Providing the arguments 9324785 and 1 should return "8.9 MB"`, () => {
        const result = formatBytes(9324785, 1);
        expect(result).toBe("8.9 MB");
    });
    test(`Providing the arguments 4665728934894231 and 3 should return "4.144 PB"`, () => {
        const result = formatBytes(4665728934894231, 3);
        expect(result).toBe("4.144 PB");
    });
    test(`Providing the arguments 728 and -1 should return "728 Bytes"`, () => {
        const result = formatBytes(728, -1);
        expect(result).toBe("728 Bytes");
    });
});
