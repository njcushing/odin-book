import { useState, useEffect } from "react";
import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import * as extendedTypes from "@shared/utils/extendedTypes";

export function GET<T>(
    functionInfo: {
        func: apiFunctionTypes.GET<T>;
        parameters?: Parameters<apiFunctionTypes.GET<T>>;
    },
    attemptOnMount?: boolean,
): [
    extendedTypes.UnwrapPromise<ReturnType<apiFunctionTypes.GET<T>>> | null,
    React.Dispatch<React.SetStateAction<Parameters<apiFunctionTypes.GET<T>> | undefined>>,
    React.Dispatch<React.SetStateAction<boolean>>,
] {
    const [params, setParams] = useState<Parameters<apiFunctionTypes.GET<T>> | undefined>(
        functionInfo.parameters,
    );
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
    }, [params, abortController, attempting, functionInfo]);

    return [response, setParams, setAttempting];
}

export function POST(
    functionInfo: {
        func: apiFunctionTypes.POST;
        parameters?: Parameters<apiFunctionTypes.POST>;
    },
    attemptOnMount?: boolean,
): [
    extendedTypes.UnwrapPromise<ReturnType<apiFunctionTypes.POST>> | null,
    React.Dispatch<React.SetStateAction<Parameters<apiFunctionTypes.POST> | undefined>>,
    React.Dispatch<React.SetStateAction<boolean>>,
] {
    const [params, setParams] = useState<Parameters<apiFunctionTypes.POST> | undefined>(
        functionInfo.parameters,
    );
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
    }, [params, abortController, attempting, functionInfo]);

    return [response, setParams, setAttempting];
}
