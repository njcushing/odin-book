import React, { useState } from "react";
import Option from "./components/Option";
import * as OptionTypes from "./components/Option/types";
import styles from "./index.module.css";

type HorizontalTypes = {
    options: OptionTypes.Option[];
    selected: string | null;
    label?: string;
    minPaddingPx?: number;
    onSelectHandler?: ((event: React.MouseEvent<HTMLAnchorElement>) => void) | null;
    style?: React.CSSProperties;
};

function Horizontal({
    options = [],
    selected = null,
    label = "navigation",
    minPaddingPx = 16,
    onSelectHandler = null,
    style = {},
}: HorizontalTypes) {
    const [optionSelected, setOptionSelected] = useState<string | null>(selected);

    return (
        <nav className={styles["container"]} aria-label={label} style={{ ...style }}>
            {options.map((option) => {
                return (
                    <Option
                        text={option.text}
                        link={option.link}
                        selected={optionSelected === option.text}
                        onClickHandler={(e: React.MouseEvent<HTMLAnchorElement>) => {
                            setOptionSelected(option.text);
                            if (onSelectHandler) onSelectHandler(e);
                        }}
                        minPaddingPx={minPaddingPx}
                        style={option.style || {}}
                        key={option.text}
                    />
                );
            })}
        </nav>
    );
}

export default Horizontal;
