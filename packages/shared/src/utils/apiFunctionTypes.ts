export type GET<T> = (
    data?: {
        params?: { [key: string | number]: unknown };
    },
    abortController?: AbortController | null,
    ...args: unknown[]
) => Promise<{
    status: number;
    message: string | null;
    data: T | null;
}>;

export type POST = (
    data?: {
        params?: { [key: string | number]: unknown };
        body?: object;
    },
    abortController?: AbortController | null,
    ...args: unknown[]
) => Promise<{
    status: number;
    message: string | null;
}>;
