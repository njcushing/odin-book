import LayoutUI from "@/layouts";
import Navigation from "../..";
import * as Types from "../../types";
import styles from "./index.module.css";

type MenuProps = {
    type: "wide" | "thin";
    options: Types.Option[];
};

function Menu({ type, options }: MenuProps) {
    const optionStyles = {
        gap: "1rem",
        width: type === "wide" ? "100%" : "auto",
    };

    return (
        <nav className={styles["nav"]}>
            <LayoutUI.List
                label="navigation"
                ordered={false}
                listItems={options.map((option) => {
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
                scrollable
                listStyles={{
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: type === "wide" ? "flex-start" : "center",
                    flexWrap: "nowrap",
                    gap: "0.2rem",
                    width: type === "wide" ? "100%" : "auto",
                    height: "auto",
                    margin: "0rem",
                }}
            />
        </nav>
    );
}

export default Menu;
