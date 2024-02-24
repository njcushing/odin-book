import { ReactElement } from "react";
import * as extendedTypes from "@/utils/extendedTypes";
import Chat from "./features/chat";

type StringKeyObject<T> = {
    [key: string]: T;
};

const sampleTextGenerator = (): string => {
    let string = "";
    const quantity = Math.ceil(Math.random() * 10);
    for (let i = 0; i < quantity; i++) {
        if (quantity === quantity - 1) string += "Sample Text";
        else string += "Sample Text ";
    }
    return string;
};

const getRandomFromObject = (obj: object) => {
    const keys = Object.keys(obj);
    return obj[keys[Math.floor(Math.random() * keys.length)]];
};

type Status = "online" | "away" | "busy" | "offline" | null;

type UserTypes = {
    _id: string;
    accountTag: string;
    preferences: {
        displayName: string;
        profileImage: { src: extendedTypes.TypedArray; alt: string };
    };
    status: Status;
};

const createUser = (
    _id: string,
    accountTag: string,
    displayName: string,
    profileImage: { src: extendedTypes.TypedArray; alt: string },
    status: Status,
): UserTypes => {
    return {
        _id,
        accountTag,
        preferences: {
            displayName,
            profileImage,
        },
        status,
    };
};

const mockUsers: StringKeyObject<UserTypes> = {
    "0": createUser("0", "CoolCat123", "Emily", { src: new Uint8Array([]), alt: "" }, "online"),
    "1": createUser("1", "AwesomeGamer", "James", { src: new Uint8Array([]), alt: "" }, "busy"),
    "2": createUser("2", "PizzaLover22", "Sophia", { src: new Uint8Array([]), alt: "" }, "online"),
    "3": createUser("3", "SunnyDayz", "William", { src: new Uint8Array([]), alt: "" }, "busy"),
    "4": createUser("4", "TechNinja", "Olivia", { src: new Uint8Array([]), alt: "" }, "online"),
    "5": createUser("5", "GuitarHero", "Alexander", { src: new Uint8Array([]), alt: "" }, "away"),
    "6": createUser("6", "StarGazer", "Emma", { src: new Uint8Array([]), alt: "" }, "offline"),
    "7": createUser("7", "ChocoChip", "Benjamin", { src: new Uint8Array([]), alt: "" }, "busy"),
    "8": createUser(
        "8",
        "AdventureTime",
        "Isabella",
        { src: new Uint8Array([]), alt: "" },
        "online",
    ),
    "9": createUser("9", "NatureLover", "Michael", { src: new Uint8Array([]), alt: "" }, "offline"),
    "10": createUser("10", "MoonWalker", "Ava", { src: new Uint8Array([]), alt: "" }, "offline"),
    "11": createUser(
        "11",
        "CoffeeAddict",
        "Daniel",
        { src: new Uint8Array([]), alt: "" },
        "online",
    ),
    "12": createUser("12", "BeachGoer", "Charlotte", { src: new Uint8Array([]), alt: "" }, "away"),
    "13": createUser("13", "BookWorm", "Jacob", { src: new Uint8Array([]), alt: "" }, "offline"),
    "14": createUser("14", "RockStar", "Amelia", { src: new Uint8Array([]), alt: "" }, "away"),
    "15": createUser("15", "PizzaLover", "Ethan", { src: new Uint8Array([]), alt: "" }, "away"),
    "16": createUser("16", "SuperStar", "Mia", { src: new Uint8Array([]), alt: "" }, "offline"),
    "17": createUser("17", "GameMaster", "Matthew", { src: new Uint8Array([]), alt: "" }, "online"),
    "18": createUser("18", "HappyCamper", "Harper", { src: new Uint8Array([]), alt: "" }, "busy"),
    "19": createUser(
        "19",
        "MidnightOwl",
        "Christopher",
        { src: new Uint8Array([]), alt: "" },
        "away",
    ),
};

type PostTypes = {
    _id: string;
    author: string;
    content: { text: string; images: { src: extendedTypes.TypedArray; alt: string }[] };
    replyingTo?: string | null;
};

const createPost = (
    _id: string,
    author: string,
    content: { text: string; images: { src: extendedTypes.TypedArray; alt: string }[] },
    replyingTo?: string | null,
): PostTypes => {
    return {
        _id,
        author,
        content,
        replyingTo,
    };
};

const createPostImages = () => {
    return [0, 0, 0, 0]
        .filter(() => Math.random() < 0.5)
        .map(() => ({
            src: new Uint8Array(),
            alt: "",
        }));
};

const mockPosts: StringKeyObject<PostTypes> = {
    "0": createPost("0", "0", { text: sampleTextGenerator(), images: createPostImages() }, null),
    "1": createPost("1", "5", { text: sampleTextGenerator(), images: createPostImages() }, "0"),
    "2": createPost("2", "8", { text: sampleTextGenerator(), images: createPostImages() }, null),
    "3": createPost("3", "3", { text: sampleTextGenerator(), images: createPostImages() }, null),
    "4": createPost("4", "2", { text: sampleTextGenerator(), images: createPostImages() }, "2"),
    "5": createPost("5", "6", { text: sampleTextGenerator(), images: createPostImages() }, null),
    "6": createPost("6", "8", { text: sampleTextGenerator(), images: createPostImages() }, "3"),
    "7": createPost("7", "12", { text: sampleTextGenerator(), images: createPostImages() }, null),
    "8": createPost("8", "17", { text: sampleTextGenerator(), images: createPostImages() }, "5"),
    "9": createPost("9", "3", { text: sampleTextGenerator(), images: createPostImages() }, "5"),
    "10": createPost("10", "19", { text: sampleTextGenerator(), images: createPostImages() }, null),
    "11": createPost("11", "0", { text: sampleTextGenerator(), images: createPostImages() }, null),
    "12": createPost("12", "1", { text: sampleTextGenerator(), images: createPostImages() }, "5"),
    "13": createPost("13", "7", { text: sampleTextGenerator(), images: createPostImages() }, null),
    "14": createPost("14", "15", { text: sampleTextGenerator(), images: createPostImages() }, "10"),
    "15": createPost("15", "9", { text: sampleTextGenerator(), images: createPostImages() }, null),
    "16": createPost("16", "11", { text: sampleTextGenerator(), images: createPostImages() }, "15"),
    "17": createPost("17", "10", { text: sampleTextGenerator(), images: createPostImages() }, "15"),
    "18": createPost("18", "6", { text: sampleTextGenerator(), images: createPostImages() }, null),
    "19": createPost("19", "18", { text: sampleTextGenerator(), images: createPostImages() }, null),
};

export const messages = (quantity: number): ReactElement[] => {
    const quantityFloored = Math.floor(quantity);
    const messageElements: ReactElement[] = [];
    for (let i = 0; i < quantityFloored; i++) {
        const messageNew = (
            <Chat.Message
                author={{
                    self: !(Math.random() < 0.5),
                    displayName: getRandomFromObject(mockUsers).displayName,
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
        const participants = Object.keys(mockUsers).filter(() => Math.random() < 0.5);
        const chatNew = (
            <Chat.Option
                name={Math.random() < 0.5 ? getRandomFromObject(mockUsers).displayName : ""}
                participants={participants.map(
                    (participant) => mockUsers[participant].preferences.displayName,
                )}
                image={{ src: new Uint8Array([]), alt: "" }}
                recentMessage={{
                    author: getRandomFromObject(mockUsers).displayName,
                    text: sampleTextGenerator(),
                }}
                key={i}
            />
        );
        chatElements.push(chatNew);
    }
    return chatElements;
};

export const getUser = (_id: string): UserTypes | null => {
    return mockUsers[_id] || null;
};

export const getUsers = (quantity: number): UserTypes[] => {
    const quantityFloored = Math.floor(quantity);
    const keys = Object.keys(mockUsers);
    const userArr: UserTypes[] = [];
    for (let i = 0; i < Math.min(quantityFloored, keys.length); i++) {
        const key = keys.pop();
        if (key) userArr.push(mockUsers[key]);
    }
    return userArr;
};

export const getPost = (_id: string): PostTypes | null => {
    return mockPosts[_id] || null;
};

export const getPosts = (quantity: number): PostTypes[] => {
    const quantityFloored = Math.floor(quantity);
    const keys = Object.keys(mockPosts);
    const postArr: PostTypes[] = [];
    for (let i = 0; i < Math.min(quantityFloored, keys.length); i++) {
        const key = keys.pop();
        if (key) postArr.push(mockPosts[key]);
    }
    return postArr;
};
