import React, { useState, useEffect, useRef } from "react";
import Buttons from "@/components/buttons";
import * as Types from "../../types";
import getSizes from "../../utils/getSizes";
import styles from "./index.module.css";

type BaseLite = Omit<Types.Base<string>, "labelText" | "fieldId" | "fieldName">;

type Custom = {
    onSearchHandler?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | null;
    searchAfterDelay?: number;
};

export type SearchTypes = BaseLite &
    Types.Placeholder &
    Types.Validator<string> &
    Types.Sizes &
    Custom;

function Search({
    initialValue = "",
    onChangeHandler = null,
    disabled = false,
    readOnly = false,
    placeholder = "",
    size = "s",
    onSearchHandler = null,
    searchAfterDelay = 0,
}: SearchTypes) {
    const [value, setValue] = useState<string>(initialValue || "");

    const timeoutId = useRef<NodeJS.Timeout | null>(null);
    const button = useRef<JSX.Element | null>(null);

    const sizes = getSizes(size, "input");

    button.current = (
        <Buttons.Basic
            text=""
            symbol="search"
            label="search"
            onClickHandler={onSearchHandler}
            disabled={disabled || false}
            otherStyles={{ ...sizes, padding: "0.6rem" }}
        />
    );

    useEffect(() => {
        if (timeoutId.current) clearTimeout(timeoutId.current);
        if (typeof searchAfterDelay !== "undefined") {
            const id = setTimeout(
                () => {
                    if (button.current) button.current.props.onClickHandler();
                    timeoutId.current = null;
                },
                Math.max(0, searchAfterDelay),
            );
            timeoutId.current = id;
        }

        return () => {
            if (timeoutId.current) clearTimeout(timeoutId.current);
        };
    }, [value, searchAfterDelay]);

    return (
        <div className={styles["container"]} data-disabled={disabled || false}>
            {button.current}
            <input
                className={`truncate-ellipsis ${styles["input"]}`}
                aria-label="search bar"
                type="text"
                defaultValue={value}
                style={{
                    resize: "none",
                    ...sizes,
                }}
                onChange={(e) => {
                    setValue(e.target.value);
                    if (onChangeHandler) onChangeHandler(e);
                }}
                disabled={disabled || false}
                readOnly={readOnly}
                placeholder={placeholder || ""}
            ></input>
        </div>
    );
}

export default Search;
