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

const createPost = (post: modelTypes.Post): modelTypes.Post => {
    return {
        _id: post._id,
        author: post.author,
        content: post.content,
        likes: post.likes,
        likesQuantity: post.likesQuantity,
        replies: post.replies,
        repliesQuantity: post.repliesQuantity,
        replyingTo: post.replyingTo,
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
    "0": createPost({
        _id: "0",
        author: mockUsers["0"],
        content: { text: sampleTextGenerator(), images: createPostImages() },
        likes: [],
        likesQuantity: 234,
        replies: [],
        repliesQuantity: 45,
        replyingTo: null,
    }),
    "1": createPost({
        _id: "1",
        author: mockUsers["5"],
        content: { text: sampleTextGenerator(), images: createPostImages() },
        likes: [],
        likesQuantity: 567,
        replies: [],
        repliesQuantity: 65,
        replyingTo: "0",
    }),
    "2": createPost({
        _id: "2",
        author: mockUsers["8"],
        content: { text: sampleTextGenerator(), images: createPostImages() },
        likes: [],
        likesQuantity: 4574,
        replies: [],
        repliesQuantity: 675,
        replyingTo: null,
    }),
    "3": createPost({
        _id: "3",
        author: mockUsers["3"],
        content: { text: sampleTextGenerator(), images: createPostImages() },
        likes: [],
        likesQuantity: 3245,
        replies: [],
        repliesQuantity: 234,
        replyingTo: null,
    }),
    "4": createPost({
        _id: "4",
        author: mockUsers["2"],
        content: { text: sampleTextGenerator(), images: createPostImages() },
        likes: [],
        likesQuantity: 824,
        replies: [],
        repliesQuantity: 37,
        replyingTo: "2",
    }),
    "5": createPost({
        _id: "5",
        author: mockUsers["6"],
        content: { text: sampleTextGenerator(), images: createPostImages() },
        likes: [],
        likesQuantity: 2323543,
        replies: [],
        repliesQuantity: 49378,
        replyingTo: null,
    }),
    "6": createPost({
        _id: "6",
        author: mockUsers["8"],
        content: { text: sampleTextGenerator(), images: createPostImages() },
        likes: [],
        likesQuantity: 3489,
        replies: [],
        repliesQuantity: 34,
        replyingTo: "3",
    }),
    "7": createPost({
        _id: "7",
        author: mockUsers["12"],
        content: { text: sampleTextGenerator(), images: createPostImages() },
        likes: [],
        likesQuantity: 782345,
        replies: [],
        repliesQuantity: 2346,
        replyingTo: null,
    }),
    "8": createPost({
        _id: "8",
        author: mockUsers["17"],
        content: { text: sampleTextGenerator(), images: createPostImages() },
        likes: [],
        likesQuantity: 9265,
        replies: [],
        repliesQuantity: 186,
        replyingTo: "5",
    }),
    "9": createPost({
        _id: "9",
        author: mockUsers["3"],
        content: { text: sampleTextGenerator(), images: createPostImages() },
        likes: [],
        likesQuantity: 1237,
        replies: [],
        repliesQuantity: 45,
        replyingTo: "5",
    }),
    "10": createPost({
        _id: "10",
        author: mockUsers["19"],
        content: { text: sampleTextGenerator(), images: createPostImages() },
        likes: [],
        likesQuantity: 6,
        replies: [],
        repliesQuantity: 0,
        replyingTo: null,
    }),
    "11": createPost({
        _id: "11",
        author: mockUsers["0"],
        content: { text: sampleTextGenerator(), images: createPostImages() },
        likes: [],
        likesQuantity: 23,
        replies: [],
        repliesQuantity: 2,
        replyingTo: null,
    }),
    "12": createPost({
        _id: "12",
        author: mockUsers["1"],
        content: { text: sampleTextGenerator(), images: createPostImages() },
        likes: [],
        likesQuantity: 0,
        replies: [],
        repliesQuantity: 0,
        replyingTo: "5",
    }),
    "13": createPost({
        _id: "13",
        author: mockUsers["7"],
        content: { text: sampleTextGenerator(), images: createPostImages() },
        likes: [],
        likesQuantity: 1,
        replies: [],
        repliesQuantity: 0,
        replyingTo: null,
    }),
    "14": createPost({
        _id: "14",
        author: mockUsers["15"],
        content: { text: sampleTextGenerator(), images: createPostImages() },
        likes: [],
        likesQuantity: 34,
        replies: [],
        repliesQuantity: 2,
        replyingTo: "10",
    }),
    "15": createPost({
        _id: "15",
        author: mockUsers["9"],
        content: { text: sampleTextGenerator(), images: createPostImages() },
        likes: [],
        likesQuantity: 953,
        replies: [],
        repliesQuantity: 18,
        replyingTo: null,
    }),
    "16": createPost({
        _id: "16",
        author: mockUsers["11"],
        content: { text: sampleTextGenerator(), images: createPostImages() },
        likes: [],
        likesQuantity: 1,
        replies: [],
        repliesQuantity: 0,
        replyingTo: "15",
    }),
    "17": createPost({
        _id: "17",
        author: mockUsers["10"],
        content: { text: sampleTextGenerator(), images: createPostImages() },
        likes: [],
        likesQuantity: 8,
        replies: [],
        repliesQuantity: 19,
        replyingTo: "15",
    }),
    "18": createPost({
        _id: "18",
        author: mockUsers["6"],
        content: { text: sampleTextGenerator(), images: createPostImages() },
        likes: [],
        likesQuantity: 3213,
        replies: [],
        repliesQuantity: 43,
        replyingTo: null,
    }),
    "19": createPost({
        _id: "19",
        author: mockUsers["18"],
        content: { text: sampleTextGenerator(), images: createPostImages() },
        likes: [],
        likesQuantity: 453724,
        replies: [],
        repliesQuantity: 2345,
        replyingTo: null,
    }),
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
