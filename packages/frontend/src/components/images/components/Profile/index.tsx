import objectURLFromTypedArray from "@/utils/objectURLFromTypedArray";
import * as Types from "../../types";
import styles from "./index.module.css";

function Profile({
    src = new Uint8Array([]),
    alt = "",
    label = "profile image",
    status = null,
    sizePx = 50,
    style,
}: Types.Profile) {
    let imgSrc = "";
    if (src) imgSrc = objectURLFromTypedArray(src);

    return (
        <div className={styles["container"]} style={{ ...style }}>
            <img
                className={styles["profile-image"]}
                aria-label={label}
                src={imgSrc}
                alt={alt}
                style={{
                    height: `${sizePx}px`,
                    width: `${sizePx}px`,
                }}
            ></img>
            {status ? (
                <div
                    className={styles["status-indicator"]}
                    aria-label="status-indicator"
                    style={{
                        outlineWidth: `${Math.floor(sizePx / 11)}px`,

                        height: `${Math.floor(sizePx / 3)}px`,
                        width: `${Math.floor(sizePx / 3)}px`,
                    }}
                    data-status={status}
                ></div>
            ) : null}
        </div>
    );
}

export default Profile;
