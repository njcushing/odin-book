import styles from "./index.module.css";

function WaitingWheel() {
    return (
        <div className={styles["container"]}>
            <div className={styles["wheel"]}></div>
        </div>
    );
}

export default WaitingWheel;
