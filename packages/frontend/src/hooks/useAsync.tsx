import { useState, useEffect } from "react";
import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import * as extendedTypes from "@shared/utils/extendedTypes";

export function GET<T>(
    initialValue: T,
    functionInfo: {
        func: apiFunctionTypes.GET<T>;
        parameters?: Parameters<apiFunctionTypes.GET<T>>;
    },
    attemptOnMount?: boolean,
): [
    T | null,
    extendedTypes.UnwrapPromise<ReturnType<apiFunctionTypes.GET<T>>> | null,
    React.Dispatch<React.SetStateAction<boolean>>,
] {
    const [value, setValue] = useState<T | null>(initialValue);
    const [response, setResponse] = useState<extendedTypes.UnwrapPromise<
        ReturnType<apiFunctionTypes.GET<T>>
    > | null>(null);
    const [abortController, setAbortController] = useState<AbortController | null>(
        new AbortController(),
    );
    const [attempting, setAttempting] = useState<boolean>(false);

    useEffect(() => {
        if (attemptOnMount) setAttempting(true);
    }, [attemptOnMount]);

    useEffect(() => {
        if (attempting) {
            if (abortController) abortController.abort();
            const abortControllerNew = new AbortController();
            setAbortController(abortControllerNew);
            (async () => {
                const params = functionInfo.parameters;
                let data;
                let args;
                if (params && "data" in params) data = params.data;
                if (params && "args" in params) args = params.args;
                const asyncResponse = await functionInfo.func(
                    data || undefined,
                    abortController,
                    args,
                );
                setValue(asyncResponse.data || null);
                setResponse(asyncResponse);
                setAbortController(null);
                setAttempting(false);
            })();
        }

        return () => {
            if (abortController) abortController.abort();
        };
    }, [abortController, attempting, functionInfo]);

    return [value, response, setAttempting];
}

export function POST(
    functionInfo: {
        func: apiFunctionTypes.POST;
        parameters?: Parameters<apiFunctionTypes.POST>;
    },
    attemptOnMount?: boolean,
): [
    extendedTypes.UnwrapPromise<ReturnType<apiFunctionTypes.POST>> | null,
    React.Dispatch<React.SetStateAction<boolean>>,
] {
    const [response, setResponse] = useState<extendedTypes.UnwrapPromise<
        ReturnType<apiFunctionTypes.POST>
    > | null>(null);
    const [abortController, setAbortController] = useState<AbortController | null>(
        new AbortController(),
    );
    const [attempting, setAttempting] = useState<boolean>(false);

    useEffect(() => {
        if (attemptOnMount) setAttempting(true);
    }, [attemptOnMount]);

    useEffect(() => {
        if (attempting) {
            if (abortController) abortController.abort();
            const abortControllerNew = new AbortController();
            setAbortController(abortControllerNew);
            (async () => {
                const params = functionInfo.parameters;
                let data;
                let args;
                if (params && "data" in params) data = params.data;
                if (params && "args" in params) args = params.args;
                const asyncResponse = await functionInfo.func(
                    data || undefined,
                    abortController,
                    args,
                );
                setResponse(asyncResponse);
                setAbortController(null);
                setAttempting(false);
            })();
        }

        return () => {
            if (abortController) abortController.abort();
        };
    }, [abortController, attempting, functionInfo]);

    return [response, setAttempting];
}
