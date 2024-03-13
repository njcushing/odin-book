export type GET<T> = (
    data?: {
        params?: { [key: string | number]: unknown };
    },
    abortController?: AbortController | null,
    ...args: unknown[]
) => Promise<{
    status: boolean;
    message: string | null;
    data: T | null;
}>;

export type POST = (
    data?: {
        params?: { [key: string | number]: unknown };
        json?: JSON;
    },
    abortController?: AbortController | null,
    ...args: unknown[]
) => Promise<{
    status: boolean;
    message: string | null;
}>;
