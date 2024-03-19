interface SystemError extends Error {
    address?: string;
    code: string;
    dest: string;
    errno: number;
    message: string;
    path?: string;
    port?: number;
    syscall: string;
}

export type { SystemError };

interface ResponseError extends Error {
    status: number;
}

export type { ResponseError };
