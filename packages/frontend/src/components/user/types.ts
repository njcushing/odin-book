import * as ImageTypes from "@/components/images/types";

export type Sizes = {
    size?: "xs" | "s" | "m" | "l" | "xl";
};

export type ImageAndName = Sizes & {
    image: ImageTypes.Profile;
    displayName: string;
    accountTag: string;
};

export type Option = {
    user: ImageAndName;
    following: boolean;
};
