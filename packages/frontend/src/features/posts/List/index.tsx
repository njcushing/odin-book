import Buttons from "@/components/buttons";
import PubSub from "pubsub-js";
import Posts from "..";
import styles from "./index.module.css";

function List() {
    const posts = [];

    return (
        <div className={styles["container"]}>
            {posts.map((post) => {
                return <Posts.Post _id={post} canToggleReplies canReply key={post} />;
            })}
            <div className={styles["create-new-post-button-wrapper"]}>
                <div className={styles["create-new-post-button-container"]}>
                    <Buttons.Basic
                        text="Create New Post"
                        symbol="stylus_note"
                        onClickHandler={() => {
                            PubSub.publish("create-new-post-button-click", null);
                        }}
                        palette="blue"
                        otherStyles={{
                            fontSize: "1.25rem",
                            padding: "0.8rem 1.6rem",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default List;
