import styles from "./index.module.css";

function LayoutMain() {
    return (
        <div className={styles["wrapper"]}>
            <div className={styles["container"]}>
                <div className={styles["navigation-panel"]}></div>
                <div className={styles["main-panel"]}></div>
                <div className={styles["other-content-panel"]}></div>
            </div>
        </div>
    );
}

export default LayoutMain;
