import Option from "./components/Option";
import * as OptionTypes from "./components/Option/types";
import styles from "./index.module.css";

type MenuTypes = {
    type: "wide" | "thin";
    label?: string;
    options: OptionTypes.Option[];
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
                    <Option
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
