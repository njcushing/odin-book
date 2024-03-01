import { Buffer } from "buffer";
import * as extendedTypes from "@shared/utils/extendedTypes";

const objectURLFromTypedArray = (src: extendedTypes.TypedArray): string => {
    const blob = new Blob([Buffer.from(src)], { type: "image/png" });
    return URL.createObjectURL(blob);
};
export default objectURLFromTypedArray;
