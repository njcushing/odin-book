import { useState, useEffect } from "react";
import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";

export function GET<T>(
    initialValue: T,
    functionInfo: {
        func: apiFunctionTypes.GET<T>;
        data?: {
            params?: { [key: string | number]: unknown };
        };
        args?: unknown[];
    },
    attemptOnMount?: boolean,
): [T | null, string, React.Dispatch<React.SetStateAction<boolean>>] {
    const [value, setValue] = useState<T | null>(initialValue);
    const [abortController, setAbortController] = useState<AbortController | null>(
        new AbortController(),
    );
    const [attempting, setAttempting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        if (attemptOnMount) setAttempting(true);
    }, [attemptOnMount]);

    useEffect(() => {
        if (attempting) {
            if (abortController) abortController.abort();
            const abortControllerNew = new AbortController();
            setAbortController(abortControllerNew);
            (async () => {
                const { status, message, data } = await functionInfo.func(
                    functionInfo.data,
                    abortController,
                    functionInfo.args,
                );
                if (status) {
                    setValue(data || null);
                    setErrorMessage("");
                } else {
                    setValue(null);
                    setErrorMessage(message || "");
                }
                setAbortController(null);
                setAttempting(false);
            })();
        }

        return () => {
            if (abortController) abortController.abort();
        };
    }, [abortController, attempting, functionInfo]);

    return [value, errorMessage, setAttempting];
}

export function POST<T>(
    initialValue: T,
    functionInfo: {
        func: apiFunctionTypes.GET<T>;
        data?: {
            params?: { [key: string | number]: unknown };
            body?: object;
        };
        args?: unknown[];
    },
    attemptOnMount?: boolean,
): [T | null, string, React.Dispatch<React.SetStateAction<boolean>>] {
    const [value, setValue] = useState<T | null>(initialValue);
    const [abortController, setAbortController] = useState<AbortController | null>(
        new AbortController(),
    );
    const [attempting, setAttempting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        if (attemptOnMount) setAttempting(true);
    }, [attemptOnMount]);

    useEffect(() => {
        if (attempting) {
            if (abortController) abortController.abort();
            const abortControllerNew = new AbortController();
            setAbortController(abortControllerNew);
            (async () => {
                const { status, message, data } = await functionInfo.func(
                    functionInfo.data,
                    abortController,
                    functionInfo.args,
                );
                if (status) {
                    setValue(data || null);
                    setErrorMessage("");
                } else {
                    setValue(null);
                    setErrorMessage(message || "");
                }
                setAbortController(null);
                setAttempting(false);
            })();
        }

        return () => {
            if (abortController) abortController.abort();
        };
    }, [abortController, attempting, functionInfo]);

    return [value, errorMessage, setAttempting];
}
