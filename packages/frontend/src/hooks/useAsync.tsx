import { useState, useEffect } from "react";
import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import * as extendedTypes from "@shared/utils/extendedTypes";

export function GET<Response>(
    functionInfo: {
        func: apiFunctionTypes.GET<Response>;
        parameters?: Parameters<apiFunctionTypes.GET<Response>>;
    },
    attemptOnMount?: boolean,
): [
    extendedTypes.UnwrapPromise<ReturnType<apiFunctionTypes.GET<Response>>> | null,
    React.Dispatch<React.SetStateAction<Parameters<apiFunctionTypes.GET<Response>> | undefined>>,
    React.Dispatch<React.SetStateAction<boolean>>,
] {
    const [params, setParams] = useState<Parameters<apiFunctionTypes.GET<Response>> | undefined>(
        functionInfo.parameters,
    );
    const [response, setResponse] = useState<extendedTypes.UnwrapPromise<
        ReturnType<apiFunctionTypes.GET<Response>>
    > | null>(null);
    const [abortController, setAbortController] = useState<AbortController | null>(null);
    const [attempting, setAttempting] = useState<boolean>(false);

    useEffect(() => {
        if (attemptOnMount) setAttempting(true);
    }, [attemptOnMount]);

    useEffect(() => {
        if (attempting) {
            if (abortController) {
                abortController.abort({ status: 400, message: "Client cancelled request" });
            }
            const abortControllerNew = new AbortController();
            setAbortController(abortControllerNew);
            (async () => {
                let data = {};
                let redundantAbortController;
                let args;
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                if (params) [data, redundantAbortController, ...args] = params;
                const asyncResponse = await functionInfo.func(data, abortController, args);
                setResponse(asyncResponse);
                setAbortController(null);
            })();
            setAttempting(false);
        }

        return () => {
            if (abortController) {
                abortController.abort({ status: 400, message: "Client cancelled request" });
            }
        };
    }, [params, abortController, attempting, functionInfo]);

    return [response, setParams, setAttempting];
}

export function POST<Body, Response>(
    functionInfo: {
        func: apiFunctionTypes.POST<Body, Response>;
        parameters?: Parameters<apiFunctionTypes.POST<Body, Response>>;
    },
    attemptOnMount?: boolean,
): [
    extendedTypes.UnwrapPromise<ReturnType<apiFunctionTypes.POST<Body, Response>>> | null,
    React.Dispatch<
        React.SetStateAction<Parameters<apiFunctionTypes.POST<Body, Response>> | undefined>
    >,
    React.Dispatch<React.SetStateAction<boolean>>,
] {
    const [params, setParams] = useState<
        Parameters<apiFunctionTypes.POST<Body, Response>> | undefined
    >(functionInfo.parameters);
    const [response, setResponse] = useState<extendedTypes.UnwrapPromise<
        ReturnType<apiFunctionTypes.POST<Body, Response>>
    > | null>(null);
    const [abortController, setAbortController] = useState<AbortController | null>(null);
    const [attempting, setAttempting] = useState<boolean>(false);

    useEffect(() => {
        if (attemptOnMount) setAttempting(true);
    }, [attemptOnMount]);

    useEffect(() => {
        if (attempting) {
            if (abortController) {
                abortController.abort({ status: 400, message: "Client cancelled request" });
            }
            const abortControllerNew = new AbortController();
            setAbortController(abortControllerNew);
            (async () => {
                let data = {};
                let redundantAbortController;
                let args;
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                if (params) [data, redundantAbortController, ...args] = params;
                const asyncResponse = await functionInfo.func(data, abortController, args);
                setResponse(asyncResponse);
                setAbortController(null);
            })();
            setAttempting(false);
        }

        return () => {
            if (abortController) {
                abortController.abort({ status: 400, message: "Client cancelled request" });
            }
        };
    }, [params, abortController, attempting, functionInfo]);

    return [response, setParams, setAttempting];
}
