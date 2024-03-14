/* global describe, test, expect */

import { vi } from "vitest";
import * as validation from "./validation";

const mockValidator: validation.Validator<string> = {
    func: vi.fn((value) => {
        if (value === "correct") {
            return {
                status: true,
                message: "Valid.",
            };
        }
        return {
            status: false,
            message: "Invalid.",
        };
    }),
    args: [],
};

describe("Function Testing...", () => {
    test(`When called, if the validator is specified, the validator should be invoked with three
     arguments: the value of the 'fieldValue' argument, the message type "front", and the validator
     arguments 'args' from the 'validator' argument, and the validator's return value should be
     returned`, () => {
        expect(validation.validate("correct", mockValidator, false)).toStrictEqual({
            status: true,
            message: "Valid.",
        });
        expect(mockValidator.func).toHaveBeenCalledWith("correct", "front", mockValidator.args);
        expect(validation.validate("incorrect", mockValidator, false)).toStrictEqual({
            status: false,
            message: "Invalid.",
        });
        expect(mockValidator.func).toHaveBeenCalledWith("incorrect", "front", mockValidator.args);
    });
    test(`Otherwise, an object containing the properties: 'status' with a value of 'true' and
     'message' with a value of 'null' should be returned, regardless of the value of the
     'fieldValue' argument`, () => {
        expect(validation.validate("correct", null, false)).toStrictEqual({
            status: true,
            message: null,
        });
        expect(validation.validate(undefined, null, false)).toStrictEqual({
            status: true,
            message: null,
        });
        expect(validation.validate(null, null, false)).toStrictEqual({
            status: true,
            message: null,
        });
        expect(validation.validate(false, null, false)).toStrictEqual({
            status: true,
            message: null,
        });
        expect(validation.validate("", null, false)).toStrictEqual({
            status: true,
            message: null,
        });
    });
    test(`If the 'required' argument has a value of 'true' and the 'fieldValue' argument is
     undefined, null, or an empty string, the 'status' property in the returned object should have a
     value of 'false', and the 'message' property should have a value of: "Field required, got 'X'",
     where 'X' is the value of the 'fieldValue' argument`, () => {
        expect(validation.validate(undefined, null, true)).toStrictEqual({
            status: false,
            message: null,
        });
        expect(validation.validate(null, null, true)).toStrictEqual({
            status: false,
            message: null,
        });
        expect(validation.validate(false, null, true)).toStrictEqual({
            status: false,
            message: null,
        });
        expect(validation.validate("", null, true)).toStrictEqual({
            status: false,
            message: null,
        });
    });
});
