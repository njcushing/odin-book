import * as ImageTypes from "@/components/images/types";
import React from "react";

export type Sizes = {
    size?: "xs" | "s" | "m" | "l" | "xl";
};

export type ImageAndName = Sizes & {
    image: ImageTypes.Profile;
    displayName: string;
    accountTag: string;
    disableLinks?: boolean;
};

export type Option = {
    user: ImageAndName;
    following: boolean;
    onClickHandler?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | null;
};
