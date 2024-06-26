import objectURLFromTypedArray from "@/utils/objectURLFromTypedArray";
import * as Types from "../../types";
import styles from "./index.module.css";

export type BasicTypes = Types.Base;

function Basic({ src, alt = "", label = "image", style }: BasicTypes) {
    let imgSrc = "";
    if (src) {
        if (typeof src === "string") {
            imgSrc = src;
        } else {
            imgSrc = objectURLFromTypedArray(src);
        }
    }

    const defaultStyles = !src
        ? {
              backgroundColor: "var(--background-tertiary)",
          }
        : {};

    return (
        <div className={styles["container"]} style={{ ...style, ...defaultStyles }}>
            {imgSrc.length > 0 && (
                <img className={styles["image"]} aria-label={label} src={imgSrc} alt={alt}></img>
            )}
        </div>
    );
}

export default Basic;
