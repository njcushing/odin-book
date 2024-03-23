import { useState, useEffect } from "react";
import * as useAsync from "@/hooks/useAsync";
import login from "./utils/login";
import styles from "./index.module.css";

function Auth() {
    const [response, setParams, setAttempting] = useAsync.GET<string>({ func: login }, false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    if (response && response.status < 400) window.location.assign("/");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code) {
            setParams([{ params: { code } }, null]);
            setAttempting(true);
        } else {
            setErrorMessage(
                "Code not returned from GitHub API. Unable to authorise login. Returning to login page.",
            );
        }
    }, [setParams, setAttempting]);

    useEffect(() => {
        if (response && response.status >= 400 && response.message && response.message.length > 0) {
            setErrorMessage(response.message);
        }
    }, [response]);

    // redirect to homepage on success
    useEffect(() => {
        if (response && response.status < 400) {
            window.location.assign("/");
        }
    }, [response]);

    // redirect back to login after a delay
    useEffect(() => {
        if (!timeoutId && response && response.status >= 400) {
            const id = setTimeout(() => {
                window.location.assign("/login");
                setTimeoutId(null);
            }, 5000);
            setTimeoutId(id);
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [timeoutId, response]);

    return (
        <div className={styles["container"]}>
            {errorMessage.length > 0 ? (
                <>
                    <p className={styles["error-message-large"]}>{errorMessage}</p>
                    <p className={styles["error-message-small"]}>Redirecting back to login...</p>
                </>
            ) : null}
        </div>
    );
}

export default Auth;
