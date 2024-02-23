import React, { useState, useEffect, useRef } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import styles from "./index.module.css";

type Option = {
    text: string;
    disabled?: boolean;
};

type HorizontalTypes = {
    options: Option[];
    selected: string | null;
    label?: string;
    minPaddingPx?: number;
    style?: React.CSSProperties;
};

function Horizontal({
    options = [],
    selected = null,
    label = "navigation",
    minPaddingPx = 16,
    style = {},
}: HorizontalTypes) {
    const [optionSelected, setOptionSelected] = useState<string | null>(selected);
    const [optionsDisplaying, setOptionsDisplaying] = useState<Option[]>(options);
    const [optionsInMenu, setOptionsInMenu] = useState<Option[]>([]);
    const [displayMenuButton, setDisplayMenuButton] = useState<boolean>(false);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const listRef = useRef<HTMLUListElement>(null);
    const hiddenMenuButtonContainerRef = useRef<HTMLDivElement>(null);
    const menuButtonContainerRef = useRef<HTMLDivElement>(null);

    const fontSize = style.fontSize || "1.1rem";

    const selectedOptionVisible =
        optionSelected && optionsInMenu.map((option) => option.text).indexOf(optionSelected) === -1;

    const menuButton = (
        <button
            type="button"
            className={styles["option"]}
            aria-label="more options"
            data-selected={menuOpen}
            data-highlighted={!selectedOptionVisible}
            onClick={() => setMenuOpen(!menuOpen)}
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
            const menuButtonWidth = hiddenMenuButtonContainerRef.current
                ? hiddenMenuButtonContainerRef.current.clientWidth
                : 0;
            if (optionsToDisplay.length < options.length) {
                if (currentWidthTotal + menuButtonWidth > maximumWidth) {
                    optionsToDisplay.pop();
                }
                setDisplayMenuButton(true);
            } else {
                setDisplayMenuButton(false);
            }
            setOptionsDisplaying(optionsToDisplay);

            const optionsToHide: Option[] = [];
            for (let i = optionsToDisplay.length; i < options.length; i++) {
                optionsToHide.push(options[i]);
            }
            setOptionsInMenu(optionsToHide);
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
        <nav className={styles["container"]} aria-label={label} style={{ ...style }}>
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
                {displayMenuButton ? <div ref={menuButtonContainerRef}>{menuButton}</div> : null}
            </ul>
            {menuOpen ? (
                <OutsideClickHandler onOutsideClick={() => setMenuOpen(false)}>
                    <ul
                        className={styles["menu"]}
                        style={
                            menuButtonContainerRef.current
                                ? {
                                      top:
                                          menuButtonContainerRef.current.offsetTop +
                                          menuButtonContainerRef.current.offsetHeight +
                                          4,
                                      right: 4,
                                  }
                                : { top: 4, right: 4 }
                        }
                    >
                        {optionsInMenu.map((option) => {
                            return (
                                <button
                                    type="button"
                                    className={styles["option"]}
                                    data-highlighted={!!(optionSelected === option.text)}
                                    onClick={() => {
                                        setOptionSelected(option.text);
                                        setMenuOpen(false);
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
                    </ul>
                </OutsideClickHandler>
            ) : null}
            <div
                className={styles["menu-button-false-render"]}
                hidden
                ref={hiddenMenuButtonContainerRef}
            >
                {menuButton}
            </div>
        </nav>
    );
}

export default Horizontal;
