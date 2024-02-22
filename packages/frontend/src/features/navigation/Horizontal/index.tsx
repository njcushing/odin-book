import { useState, useEffect, useRef } from "react";
import styles from "./index.module.css";

type Option = {
    text: string;
    disabled?: boolean;
};

type HorizontalTypes = {
    options: Option[];
    selected: string | null;
    label?: string;
};

function Horizontal({ options = [], selected = null, label = "navigation" }: HorizontalTypes) {
    const [optionSelected, setOptionSelected] = useState<string | null>(selected);
    const [optionsDisplaying, setOptionsDisplaying] = useState<Option[]>([]);
    const [displayMenuButton, setDisplayMenuButton] = useState<boolean>(false);

    const listRef = useRef(null);
    const menuButtonRef = useRef(null);

    const fontSize = "1.1rem";
    const minPaddingPx = 16;

    const menuButton = (
        <button
            type="button"
            className={styles["option"]}
            aria-label="more options"
            data-highlighted={false}
            ref={menuButtonRef}
        >
            <p
                className={`material-symbols-rounded ${styles["symbol"]}`}
                style={{
                    fontSize,
                    paddingLeft: minPaddingPx,
                    paddingRight: minPaddingPx,
                }}
            >
                menu
            </p>
            <div className={styles["highlight-bar"]}></div>
        </button>
    );

    useEffect(() => {
        let listRefCurrent: Element;
        const observer = new ResizeObserver((entries) => {
            // calculate maximum number of options that can appear in available space
            const textWidths: number[] = [];
            Array.from(entries[0].target.children).forEach((option) => {
                const optionText = option.children[0];
                textWidths.push(optionText.clientWidth);
            });
            const optionsToDisplay: Option[] = [];
            const maximumWidth = entries[0].contentRect.width;
            let currentWidthTotal = 0;
            for (let i = 0; i < textWidths.length; i++) {
                const optionWidth = textWidths[i] + 2 * minPaddingPx;
                if (currentWidthTotal + optionWidth > maximumWidth) {
                    break;
                } else {
                    optionsToDisplay.push(options[i]);
                    currentWidthTotal += optionWidth;
                }
            }

            /*
             *  if there are too many options to fit in the available space, see if the menu button
             *  can fit in the remaining space. If not, remove the last option to make room.
             */
            const menuButtonWidth = 0;
            if (optionsToDisplay.length < options.length) {
                if (currentWidthTotal + menuButtonWidth > maximumWidth) {
                    optionsToDisplay.pop();
                }
                setDisplayMenuButton(true);
            } else {
                setDisplayMenuButton(false);
            }

            setOptionsDisplaying(optionsToDisplay);
        });
        if (listRef.current) {
            listRefCurrent = listRef.current;
            observer.observe(listRef.current);
        }
        return () => {
            if (listRefCurrent instanceof Element) observer.unobserve(listRefCurrent);
        };
    }, [options, minPaddingPx]);

    let gridColumnWidths = "";
    optionsDisplaying.forEach(() => {
        gridColumnWidths += "auto ";
    });
    if (displayMenuButton) gridColumnWidths += "min-content";

    return (
        <nav className={styles["container"]} aria-label={label}>
            <ul
                className={styles["list"]}
                style={{ gridTemplateColumns: gridColumnWidths }}
                ref={listRef}
            >
                {optionsDisplaying.map((option) => {
                    return (
                        <button
                            type="button"
                            className={styles["option"]}
                            data-highlighted={!!(optionSelected === option.text)}
                            onClick={() => {
                                setOptionSelected(option.text);
                            }}
                            disabled={option.disabled && option.disabled}
                            key={option.text}
                        >
                            <div
                                className={styles["text"]}
                                style={{
                                    fontSize,
                                    paddingLeft: minPaddingPx,
                                    paddingRight: minPaddingPx,
                                }}
                            >
                                {option.text}
                            </div>
                            <div className={styles["highlight-bar"]}></div>
                        </button>
                    );
                })}
                {displayMenuButton ? menuButton : null}
            </ul>
            <div className={styles["menu-button-false-render"]}>{menuButton}</div>
        </nav>
    );
}

export default Horizontal;
