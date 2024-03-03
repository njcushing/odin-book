import Forms from "@/components/forms";
import Inputs from "@/components/inputs";

function Account() {
    return (
        <Forms.Basic
            title="Account"
            sections={[]}
            onSubmitHandler={(e: React.MouseEvent<HTMLButtonElement>) => {
                const target = e.target as HTMLButtonElement;
                if (target.form) {
                    const formData = new FormData(target.form);
                    const formFields = Object.fromEntries(formData);
                }
            }}
            button={{
                text: "Save Changes",
                palette: "green",
            }}
            appearance="plain"
            key={0}
        />
    );
}

function Preferences() {
    return (
        <Forms.Basic
            title="Preferences"
            sections={[
                {
                    fields: [
                        <Inputs.Select
                            labelText="Theme"
                            fieldId="theme"
                            fieldName="theme"
                            options={["Light", "Dark"]}
                            key={0}
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
                text: "Save Changes",
                palette: "green",
            }}
            appearance="plain"
            key={0}
        />
    );
}

function Profile() {
    return (
        <Forms.Basic
            title="Profile"
            sections={[
                {
                    fields: [
                        <Inputs.Text
                            labelText="Display Name"
                            fieldId="displayName"
                            fieldName="displayName"
                            key={0}
                        />,
                        <Inputs.TextArea
                            labelText="Bio"
                            fieldId="bio"
                            fieldName="bio"
                            maxLength={500}
                            counter
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
                text: "Save Changes",
                palette: "green",
            }}
            appearance="plain"
            key={0}
        />
    );
}

const Sections = {
    Account,
    Preferences,
    Profile,
};

export default Sections;
