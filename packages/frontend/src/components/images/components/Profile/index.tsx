import objectURLFromTypedArray from "@/utils/objectURLFromTypedArray";
import * as Types from "../../types";
import styles from "./index.module.css";

export type ProfileTypes = Types.Base & {
    status?: "online" | "away" | "busy" | "offline" | null;
    sizePx?: number;
};

function Profile({
    src,
    alt = "",
    label = "profile image",
    status = null,
    sizePx = 50,
    style,
}: ProfileTypes) {
    let imgSrc = "";
    if (src) {
        if (typeof src === "string") {
            imgSrc = src;
        } else {
            imgSrc = objectURLFromTypedArray(src);
        }
    } else {
        imgSrc =
            "https://res.cloudinary.com/djzqtvl9l/image/upload/v1715426448/default_profile_image_kcvjq4.png";
    }

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
