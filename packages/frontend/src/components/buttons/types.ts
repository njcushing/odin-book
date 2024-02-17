import React from "react";

export type Basic = {
    type?: "button" | "reset" | "submit";
    text?: string;
    label?: string;
    symbol?: string;
    onClickHandler?: ((event?: React.MouseEvent<HTMLButtonElement>) => void) | null;
    onSubmitHandler?: ((event?: React.FormEvent<HTMLButtonElement>) => void) | null;
    disabled?: boolean;
    palette?: "primary" | "secondary" | "bare" | "red" | "orange" | "green" | "blue";
    animation?: "rigid" | "squishy";
    style?: {
        shape?: "sharp" | "rounded";
    };
    otherStyles?: React.CSSProperties;
    children?: React.ReactElement | null;
};
