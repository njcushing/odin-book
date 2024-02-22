import * as extendedTypes from "@/utils/extendedTypes";

type Sizes2D = {
    widthPx?: number;
    heightPx?: number;
};

type Base = {
    src?: extendedTypes.TypedArray;
    alt?: string;
    label?: string;
    style?: React.CSSProperties;
};

export type Basic = Base & {
    size?: Sizes2D;
};

export type Profile = Base & {
    status?: "online" | "away" | "busy" | "offline" | null;
    sizePx?: number;
};
