import mongoose from "mongoose";

export type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

export type Validator<T> = {
    func: (
        value: T,
        messageType: "front" | "back",
        ...args: unknown[]
    ) => {
        status: boolean;
        message: string | null;
    };
    args?: unknown[];
} | null;

export type TypedArray =
    | Int8Array
    | Uint8Array
    | Uint8ClampedArray
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Float32Array
    | Float64Array
    | BigInt64Array
    | BigUint64Array;

export const isTypedArray = (value: unknown): boolean => {
    return (
        value instanceof Int8Array ||
        value instanceof Uint8Array ||
        value instanceof Uint8ClampedArray ||
        value instanceof Int16Array ||
        value instanceof Uint16Array ||
        value instanceof Int32Array ||
        value instanceof Uint32Array ||
        value instanceof Float32Array ||
        value instanceof Float64Array ||
        value instanceof BigInt64Array ||
        value instanceof BigUint64Array
    );
};

export type MongoDBObjectId =
    | string
    | number
    | mongoose.mongo.BSON.ObjectId
    | mongoose.mongo.BSON.ObjectIdLike
    | Uint8Array;
