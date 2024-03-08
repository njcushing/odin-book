import objectURLFromTypedArray from "@/utils/objectURLFromTypedArray";
import * as Types from "../../types";
import styles from "./index.module.css";

export type BasicTypes = Types.Base;

function Basic({ src = new Uint8Array([]), alt = "", label = "image", style }: BasicTypes) {
    let imgSrc = "";
    if (src) imgSrc = objectURLFromTypedArray(src);

    return (
        <div className={styles["container"]} style={{ ...style }}>
            <img className={styles["image"]} aria-label={label} src={imgSrc} alt={alt}></img>
        </div>
    );
}

export default Basic;
