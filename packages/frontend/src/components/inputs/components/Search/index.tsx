import React, { useState } from "react";
import Buttons from "@/components/buttons";
import * as Types from "../../types";
import getSizes from "../../utils/getSizes";
import styles from "./index.module.css";

type BaseLite = Omit<Types.Base<string>, "labelText" | "fieldId" | "fieldName">;

type Custom = { onSearchHandler?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | null };

type SearchTypes = BaseLite & Types.Placeholder & Types.Validator<string> & Types.Sizes & Custom;

function Search({
    initialValue = "",
    onChangeHandler = null,
    disabled = false,
    readOnly = false,
    placeholder = "",
    size = "s",
    onSearchHandler = null,
}: SearchTypes) {
    const [value, setValue] = useState<string>(initialValue || "");

    const sizes = getSizes(size, "input");

    return (
        <div className={styles["container"]} data-disabled={disabled || false}>
            <Buttons.Basic
                text=""
                symbol="search"
                label="search"
                onClickHandler={onSearchHandler}
                disabled={disabled || false}
                otherStyles={{ ...sizes, padding: "0.6rem" }}
            />
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
