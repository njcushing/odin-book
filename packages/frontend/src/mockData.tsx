import { ReactElement } from "react";
import * as extendedTypes from "@/utils/extendedTypes";
import { v4 as uuidv4 } from "uuid";
import Chat from "./features/chat";
import Posts from "./features/posts";

const randomNames = [
    { accountTag: "CoolCat123", displayName: "Emily" },
    { accountTag: "AwesomeGamer", displayName: "James" },
    { accountTag: "PizzaLover22", displayName: "Sophia" },
    { accountTag: "SunnyDayz", displayName: "William" },
    { accountTag: "TechNinja", displayName: "Olivia" },
    { accountTag: "GuitarHero", displayName: "Alexander" },
    { accountTag: "StarGazer", displayName: "Emma" },
    { accountTag: "ChocoChip", displayName: "Benjamin" },
    { accountTag: "AdventureTime", displayName: "Isabella" },
    { accountTag: "NatureLover", displayName: "Michael" },
    { accountTag: "MoonWalker", displayName: "Ava" },
    { accountTag: "CoffeeAddict", displayName: "Daniel" },
    { accountTag: "BeachGoer", displayName: "Charlotte" },
    { accountTag: "BookWorm", displayName: "Jacob" },
    { accountTag: "RockStar", displayName: "Amelia" },
    { accountTag: "PizzaLover", displayName: "Ethan" },
    { accountTag: "SuperStar", displayName: "Mia" },
    { accountTag: "GameMaster", displayName: "Matthew" },
    { accountTag: "HappyCamper", displayName: "Harper" },
    { accountTag: "MidnightOwl", displayName: "Christopher" },
];

type Status = "online" | "away" | "busy" | "offline" | null;
const statuses = ["online", "away", "busy", "offline", null];

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
                    displayName:
                        randomNames[Math.floor(Math.random() * randomNames.length)].displayName,
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
        const participants = randomNames.filter(() => Math.random() < 0.5);
        const chatNew = (
            <Chat.Option
                name={
                    Math.random() < 0.5
                        ? randomNames[Math.floor(Math.random() * randomNames.length)].displayName
                        : ""
                }
                participants={participants.map((participant) => participant.displayName)}
                image={{ src: new Uint8Array([]), alt: "" }}
                recentMessage={{
                    author: randomNames[Math.floor(Math.random() * randomNames.length)].displayName,
                    text: sampleTextGenerator(),
                }}
                key={i}
            />
        );
        chatElements.push(chatNew);
    }
    return chatElements;
};

export const posts = (quantity: number, type: "post" | "reply" | "summary"): ReactElement[] => {
    const quantityFloored = Math.floor(quantity);
    const postElements: ReactElement[] = [];
    for (let i = 0; i < quantityFloored; i++) {
        const postNew = <Posts.Post type={type} liked={Math.random() < 0.5} key={i} />;
        postElements.push(postNew);
    }
    return postElements;
};

type UserTypes = {
    _id: string;
    accountTag: string;
    preferences: {
        displayName: string;
        profileImage: { src: extendedTypes.TypedArray; alt: string };
    };
    status: Status;
};

export const users = (quantity: number): UserTypes[] => {
    const quantityFloored = Math.floor(quantity);
    const userElements: UserTypes[] = [];
    for (let i = 0; i < quantityFloored; i++) {
        const names = randomNames[Math.floor(Math.random() * randomNames.length)];
        const status: Status = statuses[Math.floor(Math.random() * statuses.length)];
        const userNew = {
            _id: uuidv4(),
            accountTag: names.accountTag,
            preferences: {
                displayName: names.displayName,
                profileImage: {
                    src: new Uint8Array([]),
                    alt: sampleTextGenerator(),
                },
            },
            status,
        };
        userElements.push(userNew);
    }
    return userElements;
};
