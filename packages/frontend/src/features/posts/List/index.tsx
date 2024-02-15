import LayoutUI from "@/layouts";
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
                <button
                    type="button"
                    className={styles["create-new-post-button"]}
                    onClick={(e) => {
                        e.currentTarget.blur();
                        e.preventDefault();
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.blur();
                    }}
                >
                    <p className={`material-symbols-rounded ${styles["button-symbol"]}`}>
                        stylus_note
                    </p>
                    Create New Post
                </button>
            </div>
        </div>
    );
}

export default List;
