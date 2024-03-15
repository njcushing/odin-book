export type Token = {
    accountTag?: string;
    password?: string;
    providerIds?: { githubId: string };
};

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
