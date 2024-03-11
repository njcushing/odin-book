/* global describe, test, expect */

import { vi } from "vitest";
import * as validation from "../../../utils/validation";
import { FileInfoTypes } from "..";
import validateUploadedFile from "./validateUploadedFile";

type ReturnTypes = [boolean, string, FileInfoTypes | null];

const mockValidate = vi.fn(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (fieldValue, validator, required): { status: boolean; message: string | null } => ({
        status: true,
        message: "Valid file.",
    }),
);
vi.mock("../../../utils/validation", async () => {
    const actual = await vi.importActual("../../../utils/validation");
    return {
        ...actual,
        validate: (
            fieldValue: unknown,
            validator: validation.Validator<unknown>,
            required: boolean,
        ) => mockValidate(fieldValue, validator, required),
    };
});

describe("Function Testing...", () => {
    describe(`Providing an uploaded file that does not have a 'type' that matches the provided
       'accept' string (converted to RegExp)...`, () => {
        test(`Should return a false status, the message "File type mismatch with specified string.",
         and null data`, () => {
            const [status, message, data]: ReturnTypes = validateUploadedFile(
                [
                    new ProgressEvent("progress") as ProgressEvent<FileReader>,
                    new File(["data"], "file_1.png", {
                        type: "image/png",
                    }),
                ],
                "test",
                null,
            );
            expect(status).toBeFalsy();
            expect(message).toBe("File type mismatch with specified string.");
            expect(data).toBe(null);
        });
    });
    describe("Providing an uploaded file that is not an ArrayBuffer...", () => {
        test(`Should return a false status, the message "Loaded file is not of type 'ArrayBuffer'.",
         and null data`, () => {
            const [status, message, data]: ReturnTypes = validateUploadedFile(
                [
                    new ProgressEvent("progress") as ProgressEvent<FileReader>,
                    new File(["data"], "file_1.png", {
                        type: "image/png",
                    }),
                ],
                "image/png",
                null,
            );
            expect(status).toBeFalsy();
            expect(message).toBe("Loaded file is not of type 'ArrayBuffer'.");
            expect(data).toBe(null);
        });
    });
    describe("Providing an uploaded file that fails the provided validator...", () => {
        test(`Should return a false status, the message returned by the validator, and null data`, () => {
            mockValidate.mockImplementationOnce(() => ({
                status: false,
                message: "Failed validation.",
            }));
            const arrayBuffer = new ArrayBuffer(10);
            const progressEvent = new ProgressEvent("progress", {
                loaded: 0,
                total: arrayBuffer.byteLength,
            });
            Object.defineProperty(progressEvent, "target", {
                writable: false,
                value: { result: arrayBuffer },
            });

            const [status, message, data]: ReturnTypes = validateUploadedFile(
                [
                    progressEvent as ProgressEvent<FileReader>,
                    new File([new Blob([new Uint8Array()])], "file_1.png", {
                        type: "image/png",
                    }),
                ],
                "image/png",
                null,
            );
            expect(status).toBeFalsy();
            expect(message).toBe("Failed validation.");
            expect(data).toBe(null);

            // (or a generic failure message if the validator does not return one)
        });
        test(`Should return a false status, the message "Validation failed." if the validator does
         not return its own message, and null data`, () => {
            mockValidate.mockImplementationOnce(() => ({
                status: false,
                message: null,
            }));
            const arrayBuffer = new ArrayBuffer(10);
            const progressEvent = new ProgressEvent("progress", {
                loaded: 0,
                total: arrayBuffer.byteLength,
            });
            Object.defineProperty(progressEvent, "target", {
                writable: false,
                value: { result: arrayBuffer },
            });

            const [status, message, data]: ReturnTypes = validateUploadedFile(
                [
                    progressEvent as ProgressEvent<FileReader>,
                    new File([new Blob([new Uint8Array()])], "file_1.png", {
                        type: "image/png",
                    }),
                ],
                "image/png",
                null,
            );
            expect(status).toBeFalsy();
            expect(message).toBe("Validation failed.");
            expect(data).toBe(null);
        });
    });
    describe("Otherwise...", () => {
        test(`Should return a true status, the message returned by the validator, and the data in an
         object format, with a 'data' property with a value of the uploaded file converted to a
         Uint8Array, and a 'file' property containing the file`, () => {
            const arrayBuffer = new ArrayBuffer(10);
            const progressEvent = new ProgressEvent("progress", {
                loaded: 0,
                total: arrayBuffer.byteLength,
            });
            Object.defineProperty(progressEvent, "target", {
                writable: false,
                value: { result: arrayBuffer },
            });

            const file = new File([new Blob([new Uint8Array()])], "file_1.png", {
                type: "image/png",
            });

            const [status, message, data]: ReturnTypes = validateUploadedFile(
                [progressEvent as ProgressEvent<FileReader>, file],
                "image/png",
                null,
            );
            expect(status).toBeTruthy();
            expect(message).toBe("Valid file.");
            expect(data).toStrictEqual({
                data: new Uint8Array(arrayBuffer),
                file,
            });
        });
        test(`Should return a true status, the message "Valid file." if the validator does not
         return its own message, and the data in an object format, with a 'data' property with a
         value of the uploaded file converted to a Uint8Array, and a 'file' property containing the
         file`, () => {
            mockValidate.mockImplementationOnce(() => ({
                status: true,
                message: null,
            }));
            const arrayBuffer = new ArrayBuffer(10);
            const progressEvent = new ProgressEvent("progress", {
                loaded: 0,
                total: arrayBuffer.byteLength,
            });
            Object.defineProperty(progressEvent, "target", {
                writable: false,
                value: { result: arrayBuffer },
            });

            const file = new File([new Blob([new Uint8Array()])], "file_1.png", {
                type: "image/png",
            });

            const [status, message, data]: ReturnTypes = validateUploadedFile(
                [progressEvent as ProgressEvent<FileReader>, file],
                "image/png",
                null,
            );
            expect(status).toBeTruthy();
            expect(message).toBe("Valid file.");
            expect(data).toStrictEqual({
                data: new Uint8Array(arrayBuffer),
                file,
            });
        });
    });
});
