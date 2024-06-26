import { useState } from "react";
import * as extendedTypes from "@shared/utils/extendedTypes";
import Images from "@/components/images";
import Buttons from "@/components/buttons";
import * as Types from "../../types";
import validateUploadedFile from "../File/utils/validateUploadedFile";
import Inputs from "../..";
import styles from "./index.module.css";

type AcceptedImageTypes = extendedTypes.TypedArray | string;

export type ImageInfo = {
    data: AcceptedImageTypes;
    file: File | null;
} | null;

type Custom = {
    description?: string;
    onChangeHandler?: ((image: extendedTypes.TypedArray | null) => void) | null;
    imageType?: "basic" | "profile";
    imageSizePx?: number;
    imageWidth?: string;
    imageHeight?: string;
    imageAspectRatio?: string;
};

export type TImage = Types.Base<AcceptedImageTypes> &
    Types.Error &
    Types.Validator<extendedTypes.TypedArray> &
    Types.Sizes &
    Custom;

function Image({
    labelText,
    fieldId,
    fieldName,
    initialValue = "",
    disabled = false,
    required = false,
    errorMessage = "",
    validator = null,
    size = "s",
    description = "",
    onChangeHandler = null,
    onInvalidHandler = null,
    imageType = "basic",
    imageSizePx = 64,
    imageWidth,
    imageHeight,
    imageAspectRatio,
}: TImage) {
    const [value, setValue] = useState<ImageInfo>({ data: initialValue, file: null });
    const [error, setError] = useState<string>("");

    let currentErrorMessage = "";
    if (errorMessage && errorMessage.length > 0) {
        currentErrorMessage = errorMessage;
    } else if (error && error.length > 0) {
        currentErrorMessage = error;
    }

    return (
        <div className={styles["wrapper"]}>
            <Inputs.Label labelText={labelText} fieldId={fieldId} required={required} size={size} />
            <Inputs.Description text={description} size={size} />
            <div className={styles["image-and-upload-button-container"]}>
                {imageType === "basic" ? (
                    <Images.Basic
                        src={value ? value.data : ""}
                        style={{
                            width: imageWidth,
                            height: imageHeight,
                            aspectRatio: imageAspectRatio,
                        }}
                    />
                ) : (
                    <Images.Profile src={value ? value.data : ""} sizePx={imageSizePx} />
                )}
                <Buttons.Upload
                    labelText=""
                    fieldId={fieldId}
                    fieldName={fieldName}
                    accept="image.*"
                    disabled={disabled}
                    button={{
                        symbol: "edit",
                        palette: "primary",
                        style: { shape: "rounded" },
                        otherStyles: { fontSize: "1.4rem", padding: "0.4rem" },
                    }}
                    onUploadHandler={async (uploads: [ProgressEvent<FileReader>, File][]) => {
                        const upload = uploads[0];
                        const [status, message, data] = validateUploadedFile(
                            upload,
                            "image.*",
                            validator,
                        );
                        setError(!status ? message : "");
                        if (!status && onInvalidHandler) onInvalidHandler();
                        const newImage = status && data ? data : null;
                        if (newImage) setValue(newImage);
                        if (onChangeHandler) onChangeHandler(newImage ? newImage.data : null);
                    }}
                />
            </div>
            {!disabled && currentErrorMessage.length > 0 ? (
                <Inputs.Error text={currentErrorMessage} size={size} />
            ) : null}
        </div>
    );
}

export default Image;
