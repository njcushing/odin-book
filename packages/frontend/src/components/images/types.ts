import * as extendedTypes from "@/utils/extendedTypes";

type Base = {
    src?: extendedTypes.TypedArray;
    alt?: string;
    label?: string;
    style?: React.CSSProperties;
};

export type Basic = Base;

export type Profile = Base & {
    status?: "online" | "away" | "busy" | "offline" | null;
    sizePx?: number;
};
