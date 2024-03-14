import User from "@/components/user";
import Buttons from "@/components/buttons";
import * as modelTypes from "@/utils/modelTypes";
import * as useAsync from "@/hooks/useAsync";
import getRelatedUsers from "./utils/getRelatedUsers";
import styles from "./index.module.css";

function PeopleYouMayKnow() {
    const [users] = useAsync.GET<modelTypes.User[]>([], { func: getRelatedUsers }, true);

    return (
        <div className={styles["container"]}>
            <h3 className={styles["title"]}>People You May Know</h3>
            <ul className={styles["users"]}>
                {users &&
                    users.map((user) => {
                        return (
                            <li className={styles["user"]} key={user._id}>
                                <User.Option
                                    user={{
                                        image: {
                                            src: user.preferences.profileImage.src,
                                            alt: user.preferences.profileImage.alt,
                                            status: user.status,
                                        },
                                        displayName: user.preferences.displayName,
                                        accountTag: user.accountTag,
                                        size: "s",
                                    }}
                                    onClickHandler={() => {}}
                                    following
                                />
                            </li>
                        );
                    })}
            </ul>
            <Buttons.Basic text="See More" onClickHandler={() => {}} />
        </div>
    );
}

export default PeopleYouMayKnow;
