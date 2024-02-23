import * as extendedTypes from "@/utils/extendedTypes";
import Images from "@/components/images";
import styles from "./index.module.css";

type ImageAndNameTypes = {
    image: {
        src: extendedTypes.TypedArray;
        alt?: string;
    };
    displayName: string;
    accountTag: string;
    size?: "xs" | "s" | "m" | "l" | "xl";
};

function ImageAndName({
    image = { src: new Uint8Array([]), alt: "" },
    displayName = "Display Name",
    accountTag = "@account_name",
    size = "m",
}: ImageAndNameTypes) {
    const sizes = { image: 48, displayName: 1.0, accountTag: 0.8 };
    switch (size) {
        case "xs":
            sizes.image = 36;
            sizes.displayName = 0.75;
            sizes.accountTag = 0.6;
            break;
        case "s":
            sizes.image = 48;
            sizes.displayName = 1.0;
            sizes.accountTag = 0.8;
            break;
        case "l":
            sizes.image = 72;
            sizes.displayName = 1.5;
            sizes.accountTag = 1.2;
            break;
        case "xl":
            sizes.image = 84;
            sizes.displayName = 1.75;
            sizes.accountTag = 1.4;
            break;
        case "m":
        default:
            sizes.image = 60;
            sizes.displayName = 1.25;
            sizes.accountTag = 1.0;
            break;
    }

    return (
        <div className={styles["container"]}>
            <div className={styles["row-one-left"]}>
                <Images.Profile src={image.src} alt={image.alt} sizePx={sizes.image} />
            </div>
            <div className={styles["row-one-right"]}>
                {displayName.length > 0 ? (
                    <button
                        type="button"
                        className={`truncate-ellipsis ${styles["display-name-button"]}`}
                        onClick={(e) => {
                            e.currentTarget.blur();
                            e.preventDefault();
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.blur();
                        }}
                        style={{
                            fontSize: `${sizes.displayName}rem`,
                        }}
                    >
                        {displayName}
                    </button>
                ) : null}
                {displayName.length > 0 ? (
                    <button
                        type="button"
                        className={`truncate-ellipsis ${styles["account-tag-button"]}`}
                        onClick={(e) => {
                            e.currentTarget.blur();
                            e.preventDefault();
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.blur();
                        }}
                        style={{
                            fontSize: `${sizes.accountTag}rem`,
                        }}
                    >
                        {accountTag}
                    </button>
                ) : null}
            </div>
        </div>
    );
}

export default ImageAndName;
