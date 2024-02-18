import { Buffer } from "buffer";
import * as extendedTypes from "@/utils/extendedTypes";
import styles from "./index.module.css";

type ProfileTypes = {
    src: extendedTypes.TypedArray;
    alt?: string;
    status?: "online" | "away" | "busy" | "offline" | null;
    sizePx?: number;
    style?: React.CSSProperties;
};

function Profile({
    src = new Uint8Array([]),
    alt = "",
    status = null,
    sizePx = 50,
    style,
}: ProfileTypes) {
    const blob = new Blob([Buffer.from(src)], { type: "image/png" });
    const imgSrc = URL.createObjectURL(blob);

    return (
        <div className={styles["container"]} style={{ ...style }}>
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

export default Profile;
