import LayoutUI from "@/layouts";
import Buttons from "@/components/buttons";
import Posts from "..";
import styles from "./index.module.css";

function List() {
    const posts = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    return (
        <div className={styles["container"]}>
            <LayoutUI.List
                label="navigation"
                ordered={false}
                listItems={posts.map((post) => {
                    return <Posts.Post _id={post} canToggleReplies key={post} />;
                })}
                scrollable
                listStyles={{
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    gap: "0px",
                    width: "100%",
                    height: "auto",
                    margin: "0rem",
                }}
            />
            <div className={styles["create-new-post-button-wrapper"]}>
                <Buttons.Basic
                    text="Create New Post"
                    symbol="stylus_note"
                    palette="blue"
                    otherStyles={{
                        fontSize: "1.25rem",
                        padding: "0.8rem 1.6rem",
                    }}
                />
            </div>
        </div>
    );
}

export default List;
