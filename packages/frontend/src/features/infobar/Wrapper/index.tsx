import React, { useState, useEffect, useRef } from "react";
import RecommendedUsers from "../RecommendedUsers";
import RecentPosts from "../RecentPosts";
import RecentChatActivity from "../RecentChatActivity";
import styles from "./index.module.css";

type TWrapper = {
    type?: "sticky" | "scrollable";
    initialChoices?: string[];
    style?: React.CSSProperties;
    children?: React.ReactNode;
};

const defaultStyles: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",

    gap: "0.4rem",
    padding: "0.4rem",
};

function Wrapper({ type = "sticky", initialChoices, style, children }: TWrapper) {
    const [styleState, setStyleState] = useState<React.CSSProperties | null>(style || null);
    const [choices, setChoices] = useState<string[] | null>(initialChoices || null);
    const [childrenState, setChildrenState] = useState<React.ReactNode | null>(children || null);

    // handle layout
    const [wrapperHeight, setWrapperHeight] = useState<number>(0);
    const wrapperRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (wrapperRef.current) setWrapperHeight(wrapperRef.current.clientHeight);
        else setWrapperHeight(0);
    }, [wrapperRef]);
    useEffect(() => {
        let wrapperRefCurrent: Element;
        const observer = new ResizeObserver((entries) => {
            const padding =
                parseFloat(window.getComputedStyle(entries[0].target).paddingTop) +
                parseFloat(window.getComputedStyle(entries[0].target).paddingBottom);
            setWrapperHeight(entries[0].contentRect.height + padding);
        });
        if (wrapperRef.current) {
            wrapperRefCurrent = wrapperRef.current;
            observer.observe(wrapperRef.current);
        }
        return () => {
            if (wrapperRefCurrent instanceof Element) observer.unobserve(wrapperRefCurrent);
        };
    }, [wrapperRef, choices, childrenState]);
    let wrapperTop = "0px";
    if (type === "sticky")
        wrapperTop = `min(0px, calc(calc(var(--vh, 1vh) * 100) - ${wrapperHeight}px))`;

    // subscribe to topics for customising infobar
    useEffect(() => {
        PubSub.unsubscribe("infobar-set-style");
        PubSub.unsubscribe("infobar-set-choices");
        PubSub.unsubscribe("infobar-set-children");

        PubSub.subscribe("infobar-set-style", (msg, data) => {
            setStyleState(data || defaultStyles);
        });
        PubSub.subscribe("infobar-set-choices", (msg, data) => {
            setChoices(data);
        });
        PubSub.subscribe("infobar-set-children", (msg, data) => {
            setChildrenState(data);
        });

        PubSub.publish("infobar-ready");

        return () => {
            PubSub.unsubscribe("infobar-set-style");
            PubSub.unsubscribe("infobar-set-choices");
            PubSub.unsubscribe("infobar-set-children");
        };
    }, []);

    // assign correct components based on choices
    const chosenElements = [];
    if (choices) {
        if (choices.includes("RecommendedUsers")) chosenElements.push(<RecommendedUsers />);
        if (choices.includes("RecentPosts")) chosenElements.push(<RecentPosts />);
        if (choices.includes("RecentChatActivity")) chosenElements.push(<RecentChatActivity />);
    }

    const scrollableStyles: React.CSSProperties =
        type === "scrollable"
            ? {
                  overflowX: "hidden",
                  overflowY: "auto",
                  height: "calc(var(--vh, 1vh) * 100)",
              }
            : {};

    return (choices && choices.length > 0) || childrenState ? (
        <div
            className={styles["wrapper"]}
            ref={wrapperRef}
            style={{
                ...scrollableStyles,
                top: wrapperTop,
            }}
        >
            <div
                className={styles["container"]}
                style={{
                    ...defaultStyles,
                    ...styleState,
                }}
            >
                {...chosenElements}
                {childrenState}
            </div>
        </div>
    ) : null;
}

export default Wrapper;
