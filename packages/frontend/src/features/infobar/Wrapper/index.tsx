import React, { useState, useEffect, useRef } from "react";
import RecommendedUsers from "../RecommendedUsers";
import RecentPosts from "../RecentPosts";
import RecentChatActivity from "../RecentChatActivity";
import styles from "./index.module.css";

type TWrapper = {
    initialChoices?: string[];
    style?: React.CSSProperties;
    children?: React.ReactNode;
};

function Wrapper({ initialChoices, style, children }: TWrapper) {
    const [choices, setChoices] = useState<string[] | null>(initialChoices || null);
    const [childrenState, setChildrenState] = useState<React.ReactNode | null>(children || null);

    // handle layout
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

    // subscribe to topics for customising sidebar
    useEffect(() => {
        PubSub.unsubscribe("sidebar-set-choices");
        PubSub.unsubscribe("sidebar-set-children");

        PubSub.subscribe("sidebar-set-choices", (msg, data) => {
            setChoices(data);
        });
        PubSub.subscribe("sidebar-set-children", (msg, data) => {
            setChildrenState(data);
        });

        return () => {
            PubSub.unsubscribe("sidebar-set-choices");
            PubSub.unsubscribe("sidebar-set-children");
        };
    }, []);

    // assign correct components based on choices
    const chosenElements = [];
    if (choices) {
        if (choices.includes("RecommendedUsers")) chosenElements.push(<RecommendedUsers />);
        if (choices.includes("RecentPosts")) chosenElements.push(<RecentPosts />);
        if (choices.includes("RecentChatActivity")) chosenElements.push(<RecentChatActivity />);
    }

    return (choices && choices.length > 0) || childrenState ? (
        <div className={styles["wrapper"]} ref={wrapperRef} style={{ ...style, top: wrapperTop }}>
            <div className={styles["container"]}>
                {...chosenElements}
                {children}
            </div>
        </div>
    ) : null;
}

export default Wrapper;
