import { ReactElement } from "react";
import * as modelTypes from "@/utils/modelTypes";
import * as extendedTypes from "@/utils/extendedTypes";
import Chat from "./features/chat";

type ObjectType<T> = {
    [key: string | number]: T;
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

const getRandomFromObject = (obj: ObjectType<any>) => {
    const keys = Object.keys(obj);
    return obj[keys[Math.floor(Math.random() * keys.length)]];
};

const createUser = (
    _id: string,
    accountTag: string,
    displayName: string,
    profileImage: { src: extendedTypes.TypedArray; alt: string },
    status: modelTypes.Status,
): modelTypes.User => {
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

const mockUsers: ObjectType<modelTypes.User> = {
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

const createPost = (
    _id: string,
    author: modelTypes.User,
    content: { text: string; images: { src: extendedTypes.TypedArray; alt: string }[] },
    likesQuantity: number,
    repliesQuantity: number,
    replyingTo?: string | null,
): modelTypes.Post => {
    return {
        _id,
        author,
        content,
        likesQuantity,
        repliesQuantity,
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

const mockPosts: ObjectType<modelTypes.Post> = {
    "0": createPost(
        "0",
        mockUsers["0"],
        { text: sampleTextGenerator(), images: createPostImages() },
        234,
        45,
        null,
    ),
    "1": createPost(
        "1",
        mockUsers["5"],
        { text: sampleTextGenerator(), images: createPostImages() },
        567,
        65,
        "0",
    ),
    "2": createPost(
        "2",
        mockUsers["8"],
        { text: sampleTextGenerator(), images: createPostImages() },
        4574,
        675,
        null,
    ),
    "3": createPost(
        "3",
        mockUsers["3"],
        { text: sampleTextGenerator(), images: createPostImages() },
        3245,
        234,
        null,
    ),
    "4": createPost(
        "4",
        mockUsers["2"],
        { text: sampleTextGenerator(), images: createPostImages() },
        824,
        37,
        "2",
    ),
    "5": createPost(
        "5",
        mockUsers["6"],
        { text: sampleTextGenerator(), images: createPostImages() },
        2323543,
        49378,
        null,
    ),
    "6": createPost(
        "6",
        mockUsers["8"],
        { text: sampleTextGenerator(), images: createPostImages() },
        3489,
        34,
        "3",
    ),
    "7": createPost(
        "7",
        mockUsers["12"],
        { text: sampleTextGenerator(), images: createPostImages() },
        782345,
        2346,
        null,
    ),
    "8": createPost(
        "8",
        mockUsers["17"],
        { text: sampleTextGenerator(), images: createPostImages() },
        9265,
        186,
        "5",
    ),
    "9": createPost(
        "9",
        mockUsers["3"],
        { text: sampleTextGenerator(), images: createPostImages() },
        1237,
        45,
        "5",
    ),
    "10": createPost(
        "10",
        mockUsers["19"],
        { text: sampleTextGenerator(), images: createPostImages() },
        6,
        0,
        null,
    ),
    "11": createPost(
        "11",
        mockUsers["0"],
        { text: sampleTextGenerator(), images: createPostImages() },
        23,
        2,
        null,
    ),
    "12": createPost(
        "12",
        mockUsers["1"],
        { text: sampleTextGenerator(), images: createPostImages() },
        0,
        0,
        "5",
    ),
    "13": createPost(
        "13",
        mockUsers["7"],
        { text: sampleTextGenerator(), images: createPostImages() },
        1,
        0,
        null,
    ),
    "14": createPost(
        "14",
        mockUsers["15"],
        { text: sampleTextGenerator(), images: createPostImages() },
        34,
        2,
        "10",
    ),
    "15": createPost(
        "15",
        mockUsers["9"],
        { text: sampleTextGenerator(), images: createPostImages() },
        953,
        18,
        null,
    ),
    "16": createPost(
        "16",
        mockUsers["11"],
        { text: sampleTextGenerator(), images: createPostImages() },
        1,
        0,
        "15",
    ),
    "17": createPost(
        "17",
        mockUsers["10"],
        { text: sampleTextGenerator(), images: createPostImages() },
        8,
        19,
        "15",
    ),
    "18": createPost(
        "18",
        mockUsers["6"],
        { text: sampleTextGenerator(), images: createPostImages() },
        3213,
        43,
        null,
    ),
    "19": createPost(
        "19",
        mockUsers["18"],
        { text: sampleTextGenerator(), images: createPostImages() },
        453724,
        2345,
        null,
    ),
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

export const getUser = (_id: extendedTypes.MongoDBObjectId): modelTypes.User | null => {
    return mockUsers[_id.toString()] || null;
};

export const getUsers = (quantity: number): modelTypes.User[] => {
    const quantityFloored = Math.floor(quantity);
    const keys = Object.keys(mockUsers);
    const userArr: modelTypes.User[] = [];
    for (let i = 0; i < Math.min(quantityFloored, keys.length); i++) {
        const key = keys.pop();
        if (key) userArr.push(mockUsers[key]);
    }
    return userArr;
};

export const getPost = (_id: extendedTypes.MongoDBObjectId): modelTypes.Post | null => {
    return mockPosts[_id.toString()] || null;
};

export const getPosts = (quantity: number): modelTypes.Post[] => {
    const quantityFloored = Math.floor(quantity);
    const keys = Object.keys(mockPosts);
    const postArr: modelTypes.Post[] = [];
    for (let i = 0; i < Math.min(quantityFloored, keys.length); i++) {
        const key = keys.pop();
        if (key) postArr.push(mockPosts[key]);
    }
    return postArr;
};
