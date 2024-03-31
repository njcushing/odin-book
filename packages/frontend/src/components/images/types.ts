import * as extendedTypes from "@shared/utils/extendedTypes";

export type Base = {
    src?: extendedTypes.TypedArray | string;
    alt?: string;
    label?: string;
    style?: React.CSSProperties;
};
