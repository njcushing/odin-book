import { ReactElement } from "react";
import Chat from "./features/chat";

const randomNames = [
    "Emily",
    "James",
    "Sophia",
    "William",
    "Olivia",
    "Alexander",
    "Emma",
    "Benjamin",
    "Isabella",
    "Michael",
    "Ava",
    "Daniel",
    "Charlotte",
    "Jacob",
    "Amelia",
    "Ethan",
    "Mia",
    "Matthew",
    "Harper",
    "Christopher",
];

const sampleTextGenerator = (): string => {
    let string = "";
    const quantity = Math.ceil(Math.random() * 10);
    for (let i = 0; i < quantity; i++) {
        if (quantity === quantity - 1) string += "Sample Text";
        else string += "Sample Text ";
    }
    return string;
};

export const messages = (quantity: number): ReactElement[] => {
    const quantityFloored = Math.floor(quantity);
    const messageElements: ReactElement[] = [];
    for (let i = 0; i < quantityFloored; i++) {
        const messageNew = (
            <Chat.Message
                author={{
                    self: !(Math.random() < 0.5),
                    displayName: randomNames[Math.floor(Math.random() * randomNames.length)],
                }}
                content={{ text: sampleTextGenerator() }}
                key={i}
            />
        );
        messageElements.push(messageNew);
    }
    return messageElements;
};

export const chats = (quantity: number): ReactElement[] => {
    const quantityFloored = Math.floor(quantity);
    const chatElements: ReactElement[] = [];
    for (let i = 0; i < quantityFloored; i++) {
        const participants = randomNames.filter((name) => Math.random() < 0.5);
        const chatNew = (
            <Chat.Option
                name={
                    Math.random() < 0.5
                        ? randomNames[Math.floor(Math.random() * randomNames.length)]
                        : ""
                }
                participants={participants}
                image={{ src: new Uint8Array([]), alt: "" }}
                recentMessage={{
                    author: randomNames[Math.floor(Math.random() * randomNames.length)],
                    text: sampleTextGenerator(),
                }}
                key={i}
            />
        );
        chatElements.push(chatNew);
    }
    return chatElements;
};
