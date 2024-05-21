import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Forms from "@/components/forms";
import Inputs from "@/components/inputs";
import Buttons from "@/components/buttons";
import * as useAsync from "@/hooks/useAsync";
import styles from "./index.module.css";
import loginPOST, {
    Params as LoginParams,
    Body as LoginBody,
    Response as LoginResponse,
} from "./utils/login";
import loginAsGuest, {
    Params as GuestLoginParams,
    Response as GuestLoginResponse,
} from "./utils/loginAsGuest";

function Login() {
    const navigate = useNavigate();

    const [waiting, setWaiting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    // regular login api handling
    const [loginResponse, setLoginParams, attemptLogin, attemptingLogin] = useAsync.POST<
        LoginParams,
        LoginBody,
        LoginResponse
    >({ func: loginPOST }, false);
    useEffect(() => {
        if (loginResponse) {
            if (loginResponse.status >= 400) {
                if (loginResponse.message && loginResponse.message.length > 0) {
                    setErrorMessage(loginResponse.message);
                }
            } else {
                navigate("/");
            }
        }
    }, [loginResponse, setErrorMessage, navigate]);

    // guest login api handling
    const [
        loginAsGuestResponse /* setLoginAsGuestParams */,
        ,
        attemptLoginAsGuest,
        attemptingLoginAsGuest,
    ] = useAsync.GET<GuestLoginParams, GuestLoginResponse>(
        {
            func: loginAsGuest,
            parameters: [{}, null],
        },
        false,
    );
    useEffect(() => {
        if (loginAsGuestResponse) {
            if (loginAsGuestResponse.status >= 400) {
                if (loginAsGuestResponse.message && loginAsGuestResponse.message.length > 0) {
                    setErrorMessage(loginAsGuestResponse.message);
                }
            } else {
                navigate("/");
            }
        }
    }, [loginAsGuestResponse, setErrorMessage, navigate]);

    useEffect(() => {
        setWaiting(attemptingLogin || attemptingLoginAsGuest);
    }, [attemptingLogin, attemptingLoginAsGuest]);

    const githubIcon = (
        <div className={styles["option-icon"]} aria-disabled={!!waiting}>
            <svg viewBox="0 0 128 128" aria-labelledby="title">
                <g>
                    <path d="M64 5.103c-33.347 0-60.388 27.035-60.388 60.388 0 26.682 17.303 49.317 41.297 57.303 3.017.56 4.125-1.31 4.125-2.905 0-1.44-.056-6.197-.082-11.243-16.8 3.653-20.345-7.125-20.345-7.125-2.747-6.98-6.705-8.836-6.705-8.836-5.48-3.748.413-3.67.413-3.67 6.063.425 9.257 6.223 9.257 6.223 5.386 9.23 14.127 6.562 17.573 5.02.542-3.903 2.107-6.568 3.834-8.076-13.413-1.525-27.514-6.704-27.514-29.843 0-6.593 2.36-11.98 6.223-16.21-.628-1.52-2.695-7.662.584-15.98 0 0 5.07-1.623 16.61 6.19C53.7 35 58.867 34.327 64 34.304c5.13.023 10.3.694 15.127 2.033 11.526-7.813 16.59-6.19 16.59-6.19 3.287 8.317 1.22 14.46.593 15.98 3.872 4.23 6.215 9.617 6.215 16.21 0 23.194-14.127 28.3-27.574 29.796 2.167 1.874 4.097 5.55 4.097 11.183 0 8.08-.07 14.583-.07 16.572 0 1.607 1.088 3.49 4.148 2.897 23.98-7.994 41.263-30.622 41.263-57.294C124.388 32.14 97.35 5.104 64 5.104z"></path>
                    <path d="M26.484 91.806c-.133.3-.605.39-1.035.185-.44-.196-.685-.605-.543-.906.13-.31.603-.395 1.04-.188.44.197.69.61.537.91zm2.446 2.729c-.287.267-.85.143-1.232-.28-.396-.42-.47-.983-.177-1.254.298-.266.844-.14 1.24.28.394.426.472.984.17 1.255zM31.312 98.012c-.37.258-.976.017-1.35-.52-.37-.538-.37-1.183.01-1.44.373-.258.97-.025 1.35.507.368.545.368 1.19-.01 1.452zm3.261 3.361c-.33.365-1.036.267-1.552-.23-.527-.487-.674-1.18-.343-1.544.336-.366 1.045-.264 1.564.23.527.486.686 1.18.333 1.543zm4.5 1.951c-.147.473-.825.688-1.51.486-.683-.207-1.13-.76-.99-1.238.14-.477.823-.7 1.512-.485.683.206 1.13.756.988 1.237zm4.943.361c.017.498-.563.91-1.28.92-.723.017-1.308-.387-1.315-.877 0-.503.568-.91 1.29-.924.717-.013 1.306.387 1.306.88zm4.598-.782c.086.485-.413.984-1.126 1.117-.7.13-1.35-.172-1.44-.653-.086-.498.422-.997 1.122-1.126.714-.123 1.354.17 1.444.663zm0 0"></path>
                </g>
                <desc>GitHub</desc>
            </svg>
        </div>
    );

    return (
        <div className={styles["wrapper"]}>
            <div className={styles["container"]}>
                <Forms.Basic
                    title="Log In"
                    sections={[
                        {
                            fields: [
                                <Inputs.Text
                                    labelText="Account Tag"
                                    fieldId="accountTag"
                                    fieldName="accountTag"
                                    required
                                    key={0}
                                />,
                                <Inputs.Text
                                    type="password"
                                    labelText="Password"
                                    fieldId="password"
                                    fieldName="password"
                                    required
                                    key={1}
                                />,
                            ],
                        },
                    ]}
                    onSubmitHandler={(e: React.MouseEvent<HTMLButtonElement>) => {
                        const target = e.target as HTMLButtonElement;
                        if (target.form) {
                            const formData = new FormData(target.form);
                            const formFields = Object.fromEntries(formData) as LoginBody;
                            setErrorMessage("");
                            setLoginParams([{ body: formFields }, null]);
                            attemptLogin(true);
                        }
                    }}
                    button={{
                        text: "Log In",
                        palette: "green",
                    }}
                    key={0}
                />
                {errorMessage.length > 0 ? (
                    <p className={styles["error-message"]}>{errorMessage}</p>
                ) : null}
                <div className={styles["alternate-login-container"]}>
                    <p className={styles["alternate-login-message"]}>Or, log in another way</p>
                    <div className={styles["alternate-login-options"]}>
                        {!waiting ? (
                            <a href="http://localhost:3000/auth/github">{githubIcon}</a>
                        ) : (
                            githubIcon
                        )}
                    </div>
                </div>
                <div className={styles["guest-login-container"]}>
                    <p className={styles["guest-login-message"]}>You can even log in as a guest!</p>
                    <Buttons.Basic
                        text="Guest Login"
                        onClickHandler={() => {
                            attemptLoginAsGuest(true);
                        }}
                        disabled={waiting}
                        palette="green"
                    />
                </div>
                <p className={styles["create-account-message"]}>
                    {`Don't have an account? `}
                    <strong>Create one now</strong>
                    {` by clicking the button below.`}
                </p>
                <Buttons.Basic
                    text="Create Account"
                    onClickHandler={() => {
                        navigate("/create-account");
                    }}
                    disabled={waiting}
                    palette="gold"
                />
            </div>
        </div>
    );
}

export default Login;
