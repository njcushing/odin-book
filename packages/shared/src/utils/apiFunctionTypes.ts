export type GET<Response> = (
    data: {
        params?: { [key: string | number]: unknown };
    },
    abortController: AbortController | null,
    ...args: unknown[]
) => Promise<{
    status: number;
    message: string | null;
    data: Response | null;
}>;

export type POST<Body, Response> = (
    data: {
        params?: { [key: string | number]: unknown };
        body?: Body;
    },
    abortController: AbortController | null,
    ...args: unknown[]
) => Promise<{
    status: number;
    message: string | null;
    data?: Response;
}>;
