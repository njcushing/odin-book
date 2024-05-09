import React, { useState, useEffect, useRef } from "react";
import styles from "./index.module.css";

type TWrapper = {
    children?: React.ReactNode;
};

function Wrapper({ children }: TWrapper) {
    const [wrapperHeight, setWrapperHeight] = useState<number>(0);

    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (wrapperRef.current) setWrapperHeight(wrapperRef.current.clientHeight);
        else setWrapperHeight(0);
    }, [wrapperRef, wrapperHeight]);

    useEffect(() => {
        let wrapperRefCurrent: Element;
        const observer = new ResizeObserver((entries) => {
            setWrapperHeight(entries[0].contentRect.height);
        });
        if (wrapperRef.current) {
            wrapperRefCurrent = wrapperRef.current;
            observer.observe(wrapperRef.current);
        }
        return () => {
            if (wrapperRefCurrent instanceof Element) observer.unobserve(wrapperRefCurrent);
        };
    }, []);

    const wrapperTop = `min(0px, calc(100vh - ${wrapperHeight}px))`;

    return (
        <div className={styles["wrapper"]} ref={wrapperRef} style={{ top: wrapperTop }}>
            <div className={styles["container"]}>{children}</div>
        </div>
    );
}

export default Wrapper;
