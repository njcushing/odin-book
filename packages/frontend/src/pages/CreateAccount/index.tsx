import Forms from "@/components/forms";
import Inputs from "@/components/inputs";
import Buttons from "@/components/buttons";
import validation from "@shared/validation";
import styles from "./index.module.css";
import createAccountPOST from "./utils/createAccount";

function CreateAccount() {
    return (
        <div className={styles["wrapper"]}>
            <div className={styles["container"]}>
                <Forms.Basic
                    title="Create a New Account"
                    sections={[
                        {
                            fields: [
                                <Inputs.Text
                                    labelText="Account Tag"
                                    fieldId="accountTag"
                                    fieldName="accountTag"
                                    validator={{ func: validation.user.accountTag }}
                                    required
                                    key={0}
                                />,
                                <Inputs.Text
                                    type="email"
                                    labelText="Email"
                                    fieldId="email"
                                    fieldName="email"
                                    validator={{ func: validation.user.email }}
                                    required
                                    key={1}
                                />,
                                <Inputs.Text
                                    type="password"
                                    labelText="Password"
                                    fieldId="password"
                                    fieldName="password"
                                    validator={{ func: validation.user.password }}
                                    required
                                    key={1}
                                />,
                                <Inputs.Text
                                    type="password"
                                    labelText="Confirm Password"
                                    fieldId="confirmPassword"
                                    fieldName="confirmPassword"
                                    validator={{ func: validation.user.confirmPassword }}
                                    required
                                    key={1}
                                />,
                            ],
                        },
                    ]}
                    onSubmitHandler={async (e: React.MouseEvent<HTMLButtonElement>) => {
                        const target = e.target as HTMLButtonElement;
                        if (target.form) {
                            const formData = new FormData(target.form);
                            const formFields = Object.fromEntries(formData) as {
                                accountTag: string;
                                email: string;
                                password: string;
                                confirmPassword: string;
                            };
                            const apiResponse = await createAccountPOST({ body: formFields });
                            if (apiResponse.status <= 400) {
                                window.location.assign("/");
                            }
                        }
                    }}
                    button={{
                        text: "Create Account",
                        palette: "green",
                    }}
                    key={0}
                />
                <Buttons.Basic
                    text="Return to Login"
                    onClickHandler={() => {
                        window.location.href = "/login";
                    }}
                    palette="bare"
                />
            </div>
        </div>
    );
}

export default CreateAccount;
