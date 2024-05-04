import { useState, useEffect } from "react";
import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import * as extendedTypes from "@shared/utils/extendedTypes";

export function GET<Params, Response>(
    functionInfo: {
        func: apiFunctionTypes.GET<Params, Response>;
        parameters?: Parameters<apiFunctionTypes.GET<Params, Response>>;
    },
    attemptOnMount?: boolean,
): [
    extendedTypes.UnwrapPromise<ReturnType<apiFunctionTypes.GET<Params, Response>>> | null,
    React.Dispatch<
        React.SetStateAction<Parameters<apiFunctionTypes.GET<Params, Response>> | undefined>
    >,
    React.Dispatch<React.SetStateAction<boolean>>,
    boolean,
] {
    const [params, setParams] = useState<
        Parameters<apiFunctionTypes.GET<Params, Response>> | undefined
    >(functionInfo.parameters);
    const [response, setResponse] = useState<extendedTypes.UnwrapPromise<
        ReturnType<apiFunctionTypes.GET<Params, Response>>
    > | null>(null);
    const [abortController, setAbortController] = useState<AbortController | null>(null);
    const [attempting, setAttempting] = useState<boolean>(false);
    const [awaiting, setAwaiting] = useState<boolean>(attemptOnMount || false);

    useEffect(() => {
        if (attemptOnMount) setAttempting(true);
    }, [attemptOnMount]);

    useEffect(() => {
        if (attempting) {
            if (abortController) {
                abortController.abort({ status: 299, message: "Client cancelled request" });
            }
            const abortControllerNew = new AbortController();
            setAbortController(abortControllerNew);
            setResponse(null);
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
                abortController.abort({ status: 299, message: "Client cancelled request" });
            }
        };
    }, [params, abortController, attempting, functionInfo]);

    useEffect(() => {
        if (attempting) {
            setAwaiting(true);
            // the abortController is only ever null when the API function is either finished or aborted
        } else if (!abortController) {
            setAwaiting(false);
        }
    }, [attempting, abortController]);

    return [response, setParams, setAttempting, awaiting];
}

export function DELETE<Params, Response>(
    functionInfo: {
        func: apiFunctionTypes.GET<Params, Response>;
        parameters?: Parameters<apiFunctionTypes.GET<Params, Response>>;
    },
    attemptOnMount?: boolean,
) {
    return GET<Params, Response>(functionInfo, attemptOnMount);
}

export function POST<Params, Body, Response>(
    functionInfo: {
        func: apiFunctionTypes.POST<Params, Body, Response>;
        parameters?: Parameters<apiFunctionTypes.POST<Params, Body, Response>>;
    },
    attemptOnMount?: boolean,
): [
    extendedTypes.UnwrapPromise<ReturnType<apiFunctionTypes.POST<Params, Body, Response>>> | null,
    React.Dispatch<
        React.SetStateAction<Parameters<apiFunctionTypes.POST<Params, Body, Response>> | undefined>
    >,
    React.Dispatch<React.SetStateAction<boolean>>,
    boolean,
] {
    const [params, setParams] = useState<
        Parameters<apiFunctionTypes.POST<Params, Body, Response>> | undefined
    >(functionInfo.parameters);
    const [response, setResponse] = useState<extendedTypes.UnwrapPromise<
        ReturnType<apiFunctionTypes.POST<Params, Body, Response>>
    > | null>(null);
    const [abortController, setAbortController] = useState<AbortController | null>(null);
    const [attempting, setAttempting] = useState<boolean>(false);
    const [awaiting, setAwaiting] = useState<boolean>(attemptOnMount || false);

    useEffect(() => {
        if (attemptOnMount) setAttempting(true);
    }, [attemptOnMount]);

    useEffect(() => {
        if (attempting) {
            if (abortController) {
                abortController.abort({ status: 299, message: "Client cancelled request" });
            }
            const abortControllerNew = new AbortController();
            setAbortController(abortControllerNew);
            setResponse(null);
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
                abortController.abort({ status: 299, message: "Client cancelled request" });
            }
        };
    }, [params, abortController, attempting, functionInfo]);

    useEffect(() => {
        if (attempting) {
            setAwaiting(true);
            // the abortController is only ever null when the API function is either finished or aborted
        } else if (!abortController) {
            setAwaiting(false);
        }
    }, [attempting, abortController]);

    return [response, setParams, setAttempting, awaiting];
}

export function PUT<Params, Body, Response>(
    functionInfo: {
        func: apiFunctionTypes.POST<Params, Body, Response>;
        parameters?: Parameters<apiFunctionTypes.POST<Params, Body, Response>>;
    },
    attemptOnMount?: boolean,
) {
    return POST<Params, Body, Response>(functionInfo, attemptOnMount);
}
