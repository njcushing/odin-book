import plain from "./plain.module.css";
import style1 from "./style1.module.css";

type Style = "plain" | "1";

const styles = {
    plain,
    style1,
};

export const getStyles = (style: Style) => {
    switch (style) {
        case "1":
            return styles.style1;
        case "plain":
        default:
            return styles.plain;
    }
};

export default styles;
