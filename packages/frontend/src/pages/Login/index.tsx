import Forms from "@/components/forms";
import Inputs from "@/components/inputs";
import Buttons from "@/components/buttons";
import styles from "./index.module.css";

function Login() {
    return (
        <div className={styles["container"]}>
            <Forms.Basic
                title="Log In"
                sections={[
                    {
                        fields: [
                            <Inputs.Text
                                labelText="Username"
                                fieldId="username"
                                fieldName="username"
                                key={0}
                            />,
                            <Inputs.Password
                                labelText="Password"
                                fieldId="password"
                                fieldName="password"
                                key={1}
                            />,
                        ],
                    },
                ]}
                onSubmitHandler={(e: React.MouseEvent<HTMLButtonElement>) => {
                    const target = e.target as HTMLButtonElement;
                    if (target.form) {
                        const formData = new FormData(target.form);
                        const formFields = Object.fromEntries(formData);
                    }
                }}
                button={{
                    text: "Log In",
                    palette: "green",
                }}
                key={0}
            />
            <p className={styles["create-account-message"]}>
                {`Don't have an account? `}
                <strong>Create one now</strong>
                {` by clicking the button below.`}
            </p>
            <Buttons.Basic text="Create Account" palette="gold" />
        </div>
    );
}

export default Login;
