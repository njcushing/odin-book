import Navigation from "../..";
import * as Types from "../../types";
import styles from "./index.module.css";

type MenuTypes = {
    type: "wide" | "thin";
    label?: string;
    options: Types.Option[];
};

function Menu({ type, label = "", options }: MenuTypes) {
    const optionStyles = {
        gap: "1rem",
        width: type === "wide" ? "100%" : "auto",
    };

    return (
        <nav className={styles["nav"]} aria-label={label}>
            {options.map((option) => {
                return (
                    <Navigation.Option
                        text={type === "wide" ? option.text : ""}
                        symbol={option.symbol}
                        onClickHandler={option.onClickHandler}
                        link={option.link}
                        style={{ ...optionStyles, ...option.style }}
                        highlighted={option.highlighted}
                        key={option.text}
                    />
                );
            })}
        </nav>
    );
}

export default Menu;
