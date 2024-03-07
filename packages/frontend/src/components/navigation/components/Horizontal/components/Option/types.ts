import React from "react";

export type Option = {
    text: string;
    link?: string;
    selected?: boolean;
    onClickHandler?: ((event: React.MouseEvent<HTMLAnchorElement>) => void) | null;
    minPaddingPx?: number;
    style?: React.CSSProperties;
};
