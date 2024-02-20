import * as extendedTypes from "@/utils/extendedTypes";

export type Profile = {
    src?: extendedTypes.TypedArray;
    alt?: string;
    status?: "online" | "away" | "busy" | "offline" | null;
    sizePx?: number;
    style?: React.CSSProperties;
};
