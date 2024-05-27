import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/user";
import { Response } from "@/features/chat/utils/getChatOverview";
import { ReturnTypes } from "@/features/chat/Active/utils/extractParticipantsInformation";
import * as extendedTypes from "@shared/utils/extendedTypes";
import styles from "./index.module.css";

type Images = {
    _id: extendedTypes.MongooseObjectId;
    url: string;
    alt: string;
}[];

export type TImage = {
    chatData: Response;
    participantsInfo: ReturnTypes;
    style?: React.CSSProperties;
};

const defaultStyles: React.CSSProperties = {
    width: "64px",
    height: "64px",
};

const defaultProfileImage = () => ({
    _id: extendedTypes.newMongooseObjectId(),
    url: "https://res.cloudinary.com/djzqtvl9l/image/upload/v1715426448/default_profile_image_kcvjq4.png",
    alt: "",
});

function Image({ chatData, participantsInfo, style }: TImage) {
    const { extract } = useContext(UserContext);

    const [images, setImages] = useState<Images>([]);

    useEffect(() => {
        let newImages: Images = [];
        if (chatData) {
            if (chatData.image) {
                newImages = [chatData.image];
            } else {
                const userId = extract("_id");
                const participantsIds = Object.keys(participantsInfo);
                const profileImages: Images = [];
                let i = 0;
                while (i < participantsIds.length && profileImages.length < 3) {
                    const participant = participantsInfo[participantsIds[i]];
                    if (participant.userId !== userId) {
                        if (participant.profileImage) {
                            profileImages.push(participant.profileImage);
                        } else {
                            profileImages.push(defaultProfileImage());
                        }
                    }
                    i += 1;
                }
                newImages = profileImages;
            }
        }
        if (newImages.length === 0) newImages.push(defaultProfileImage());
        setImages(newImages);
    }, [chatData, participantsInfo, extract]);

    let containerStyles: React.CSSProperties = {};
    let imageStyles: React.CSSProperties[] = [{}];
    switch (images.length) {
        case 3:
            containerStyles = {
                display: "grid",
                gridTemplateRows: "repeat(2, 50%)",
                gridTemplateColumns: "repeat(2, 50%)",
            };
            imageStyles = [
                {
                    gridArea: "1 / 1 / -1 / 2",
                },
                {
                    gridArea: "1 / 2 / 2 / -1",
                },
                {
                    gridArea: "2 / 2 / -1 / -1",
                },
            ];
            break;
        case 2:
            containerStyles = {
                display: "grid",
                gridTemplateColumns: "repeat(2, 50%)",
            };
            imageStyles = [
                {
                    gridArea: "1 / 1 / -1 / 2",
                },
                {
                    gridArea: "1 / 2 / -1 / -1",
                },
            ];
            break;
        case 0:
            containerStyles = { backgroundColor: "var(--background-tertiary)" };
            break;
        case 1:
        default:
            containerStyles = { display: "flex" };
    }

    return (
        <div
            className={styles["container"]}
            style={{ ...defaultStyles, ...style, ...containerStyles }}
        >
            {images.map((image, i) => {
                return (
                    <img
                        className={styles["chat-image"]}
                        src={image.url}
                        alt={image.alt}
                        style={{ ...imageStyles[i] }}
                        key={`chat-image-${image._id}`}
                    ></img>
                );
            })}
        </div>
    );
}

export default Image;
