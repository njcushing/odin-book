export type GET<Params, Response> = (
    data: {
        params?: Params;
    },
    abortController: AbortController | null,
    ...args: unknown[]
) => Promise<{
    status: number;
    message: string | null;
    data: Response | null;
}>;

export type POST<Params, Body, Response> = (
    data: {
        params?: Params;
        body?: Body;
    },
    abortController: AbortController | null,
    ...args: unknown[]
) => Promise<{
    status: number;
    message: string | null;
    data?: Response;
}>;
