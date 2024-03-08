import { BasicTypes as ButtonBasicTypes } from "@/components/buttons/components/Basic";
import { ProfileTypes } from "@/components/images/components/Profile";

export type Sizes = {
    size?: "xs" | "s" | "m" | "l" | "xl";
};

export type ImageAndName = Sizes & {
    image: ProfileTypes;
    displayName: string;
    accountTag: string;
    disableLinks?: boolean;
};

export type Option = {
    user: ImageAndName;
    following: boolean;
    onClickHandler?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | null;
};

export type Finder = {
    placeholder?: string;
    button?: ButtonBasicTypes;
    clearFindOnClick?: boolean;
};
