import Buttons from "@/components/buttons";
import Images from "@/components/images";
import * as extendedTypes from "@/utils/extendedTypes";
import formatDate from "@/utils/formatDate";
import styles from "./index.module.css";

type NormalImageTypes = {
    src: extendedTypes.TypedArray;
    alt?: string;
};

type ProfileImageTypes = {
    src: extendedTypes.TypedArray;
    alt?: string;
    sizePx?: number;
    style?: React.CSSProperties;
};

type ReplyingToTypes = {
    author: string;
    text?: string;
    image?: NormalImageTypes;
};

type AuthorTypes = {
    self: boolean;
    displayName?: string;
    image?: ProfileImageTypes;
    status?: "online" | "away" | "busy" | "offline" | null;
};

type ContentTypes = {
    text?: string;
    image?: NormalImageTypes;
    dateSent?: string;
    replyingTo?: ReplyingToTypes;
};

type MessageTypes = {
    author: AuthorTypes;
    content: ContentTypes;
    onReplyClickHandler?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
};

const formatImage = (src: extendedTypes.TypedArray): string => {
    const blob = new Blob([Buffer.from(src)], { type: "image/png" });
    return URL.createObjectURL(blob);
};

function Message({ author, content, onReplyClickHandler }: MessageTypes) {
    return (
        <div className={styles["wrapper"]} data-position={author.self}>
            <div className={styles["container"]}>
                <div className={styles["profile-image"]} data-position={author.self}>
                    <Images.Profile
                        src={author.image && author.image.src}
                        alt={author.image && author.image.alt}
                        status={author && author.status}
                        sizePx={48}
                    />
                </div>
                <div className={styles["message-container"]} data-position={author.self}>
                    {content.text && content.text.length > 0 ? (
                        <p className={styles["message-text"]} aria-label="message-text">
                            {content.text}
                        </p>
                    ) : null}
                    {content.image ? (
                        <div className={styles["message-image-container"]}>
                            <img
                                className={styles["message-image"]}
                                aria-label="message-image"
                                src={content.image.src && formatImage(content.image.src)}
                                alt={content.image.alt || ""}
                            ></img>
                        </div>
                    ) : null}
                    {content.replyingTo ? (
                        <div className={styles["replying-to-message-container"]}>
                            <p
                                className={styles["replying-to-message-text"]}
                                aria-label="replying-to-message-text"
                            >{`${content.replyingTo.author}: ${content.replyingTo.text && content.replyingTo}`}</p>
                            {content.replyingTo.image ? (
                                <div className={styles["replying-to-message-image-container"]}>
                                    <img
                                        className={styles["replying-to-message-image"]}
                                        aria-label="replying-to-message-image"
                                        src={
                                            content.replyingTo.image.src &&
                                            formatImage(content.replyingTo.image.src)
                                        }
                                        alt={content.replyingTo.image.alt}
                                    ></img>
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                </div>
                <div className={styles["option-button"]} data-position={author.self}>
                    <Buttons.Basic
                        text=""
                        symbol="reply"
                        onClickHandler={(e?: React.MouseEvent<HTMLButtonElement>) => {
                            if (onReplyClickHandler) onReplyClickHandler(e);
                        }}
                        style={{ shape: "rounded" }}
                    />
                </div>
                <p
                    className={styles["name-and-date-string"]}
                    aria-label="author-and-date"
                    data-position={author.self}
                >
                    {`${author.displayName} at ${formatDate(content.dateSent || "")}`}
                </p>
            </div>
        </div>
    );
}

export default Message;
