import User from "@/components/user";
import Buttons from "@/components/buttons";
import styles from "./index.module.css";

function PeopleYouMayKnow() {
    const users = [
        {
            image: { src: new Uint8Array([]), alt: "" },
            displayName: "John Smith",
            accountTag: "@JohnSmith84",
        },
        {
            image: { src: new Uint8Array([]), alt: "" },
            displayName: "John Smith",
            accountTag: "@JohnSmith84",
        },
        {
            image: { src: new Uint8Array([]), alt: "" },
            displayName: "John Smith",
            accountTag: "@JohnSmith84",
        },
    ];

    return (
        <div className={styles["container"]}>
            <h3 className={styles["title"]}>People You May Know</h3>
            <ul className={styles["users"]}>
                {users.map((user, i) => {
                    return (
                        <li className={styles["user"]} key={i}>
                            <User.ImageAndName
                                image={{ src: user.image.src, alt: user.image.alt }}
                                displayName={user.displayName}
                                accountTag={user.accountTag}
                                size="s"
                            />
                            <Buttons.Basic
                                text="Follow"
                                symbol="person_add"
                                palette="orange"
                                otherStyles={{ fontSize: "0.9rem" }}
                            />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default PeopleYouMayKnow;
