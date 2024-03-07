import React from "react";

export type Basic = {
    type?: "button" | "reset" | "submit";
    text?: string;
    symbol?: string;
    label?: string;
    onClickHandler?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | null;
    disabled?: boolean;
    allowDefaultEventHandling?: boolean;
    palette?: "primary" | "secondary" | "bare" | "red" | "orange" | "gold" | "green" | "blue";
    animation?: "rigid" | "squishy";
    style?: {
        shape?: "sharp" | "rounded";
    };
    otherStyles?: React.CSSProperties;
    children?: React.ReactElement | null;
};

export type Upload = {
    labelText?: string;
    fieldId?: string;
    fieldName?: string;
    accept?: string;
    multiple?: boolean;
    button?: Basic;
    onUploadHandler?: ((uploads: [ProgressEvent<FileReader>, File][]) => void) | null;
};
