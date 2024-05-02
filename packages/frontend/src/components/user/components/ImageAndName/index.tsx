import { useNavigate } from "react-router-dom";
import Images from "@/components/images";
import Accessibility from "@/components/accessibility";
import { ProfileTypes } from "@/components/images/components/Profile";
import * as Types from "../../types";
import styles from "./index.module.css";

export type ImageAndNameTypes = Types.Sizes & {
    image: ProfileTypes;
    displayName: string;
    accountTag: string;
    disableLinks?: boolean;
    waiting?: boolean;
};

function ImageAndName({
    image = { src: "", alt: "" },
    displayName = "Display Name",
    accountTag = "account_name",
    disableLinks = false,
    waiting = false,
    size = "m",
}: ImageAndNameTypes) {
    const navigate = useNavigate();

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

    let name = "User";
    if (displayName.length > 0) name = displayName;
    else if (displayName.length === 0 && accountTag.length > 0) name = accountTag;

    return (
        <div className={styles["container"]}>
            <div className={styles["row-one-left"]}>
                <Accessibility.Skeleton waiting={waiting} style={{ borderRadius: "9999px" }}>
                    <Images.Profile src={image.src} alt={image.alt} sizePx={sizes.image} />
                </Accessibility.Skeleton>
            </div>
            <div className={styles["row-one-right"]}>
                <Accessibility.Skeleton
                    waiting={waiting}
                    style={{
                        width: "100%",
                        height: `${sizes.displayName + 0.2}rem`,
                    }}
                >
                    <button
                        type="button"
                        className={`truncate-ellipsis ${styles["display-name-button"]}`}
                        aria-label="display name"
                        onClick={(e) => {
                            navigate(`/user/${accountTag}`);
                            e.currentTarget.blur();
                            e.preventDefault();
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.blur();
                        }}
                        disabled={disableLinks}
                        style={{
                            fontSize: `${sizes.displayName}rem`,
                        }}
                    >
                        {name}
                    </button>
                </Accessibility.Skeleton>
                <Accessibility.Skeleton
                    waiting={waiting}
                    style={{
                        width: "100%",
                        height: `${sizes.accountTag + 0.2}rem`,
                    }}
                >
                    <button
                        type="button"
                        className={`truncate-ellipsis ${styles["account-tag-button"]}`}
                        aria-label="account tag"
                        onClick={(e) => {
                            navigate(`/user/${accountTag}`);
                            e.currentTarget.blur();
                            e.preventDefault();
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.blur();
                        }}
                        disabled={disableLinks}
                        style={{
                            fontSize: `${sizes.accountTag}rem`,
                        }}
                    >
                        @{accountTag.length > 0 ? accountTag : "user"}
                    </button>
                </Accessibility.Skeleton>
            </div>
        </div>
    );
}

export default ImageAndName;
