import LayoutUI from "@/layouts";
import Buttons from "@/components/buttons";
import Posts from "..";
import styles from "./index.module.css";

function List() {
    const posts = [null, null, null, null, null, null, null, null];

    return (
        <div className={styles["container"]}>
            <LayoutUI.List
                label="navigation"
                ordered={false}
                listItems={posts.map((post, i) => {
                    return <Posts.Post key={i} />;
                })}
                scrollable
                listStyles={{
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    gap: "1px",
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
