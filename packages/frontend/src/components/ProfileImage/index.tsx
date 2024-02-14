import * as extendedTypes from "@/utils/extendedTypes";
import styles from "./index.module.css";

type ProfileImageTypes = {
    src: extendedTypes.TypedArray;
    alt?: string;
    status?: "online" | "away" | "busy" | "offline" | null;
    sizePx?: number;
};

function ProfileImage({
    src = new Uint8Array([]),
    alt = "",
    status = null,
    sizePx = 50,
}: ProfileImageTypes) {
    const blob = new Blob([Buffer.from(src)], { type: "image/png" });
    const imgSrc = URL.createObjectURL(blob);

    return (
        <div className={styles["container"]}>
            <img
                className={styles["profile-image"]}
                aria-label="profile-image"
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

export default ProfileImage;
