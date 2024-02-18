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
