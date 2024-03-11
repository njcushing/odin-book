import * as extendedTypes from "@shared/utils/extendedTypes";
import * as validation from "../../../utils/validation";
import { FileInfoTypes } from "..";

type UploadType = [ProgressEvent<FileReader>, File];

export type ReturnTypes = [boolean, string, FileInfoTypes | null];

const validateUploadedFile = (
    upload: UploadType,
    accept: string,
    validator: validation.Validator<extendedTypes.TypedArray> | null,
): ReturnTypes => {
    const [event, file] = upload;
    const acceptRegExp = new RegExp(`^(${accept.replace(/,/g, "|").replace(/\s/g, "")})$`);
    if (!acceptRegExp.test(file.type)) {
        return [false, "File type mismatch with specified string.", null];
    }
    if (event.target && event.target.result && event.target.result instanceof ArrayBuffer) {
        const fileArray = new Uint8Array(event.target.result);
        const valid = validation.validate(fileArray, validator || null, false);
        if (!valid.status) {
            return [false, valid.message || "Validation failed.", null];
        }
        return [
            true,
            valid.message || "Valid file.",
            {
                data: fileArray,
                file,
            },
        ];
    }
    return [false, "Loaded file is not of type 'ArrayBuffer'.", null];
};

export default validateUploadedFile;
