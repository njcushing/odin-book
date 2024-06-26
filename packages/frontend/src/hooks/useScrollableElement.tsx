import { useState, useEffect, useCallback, useRef } from "react";

type Params = {
    atTopCallback?: () => unknown;
    atBottomCallback?: () => unknown;
    isInverted?: boolean;
    leniency?: number;
    onlyCallbackOnCorrectDirectionalScroll?: boolean;
};

function useScrollableElement(params: Params, dependencies: unknown[] | undefined = undefined) {
    const {
        atTopCallback = null,
        atBottomCallback = null,
        isInverted,
        leniency = 10,
        onlyCallbackOnCorrectDirectionalScroll,
    } = params;

    const [isScrollable, setIsScrollable] = useState<boolean>(false);
    const [current, setCurrent] = useState<HTMLElement | null>(null);

    const isAtTop = useRef<boolean>(false);
    const isAtBottom = useRef<boolean>(false);
    const previousScrollTopRef = useRef<number>(0);

    const refCallback = useCallback((node: HTMLElement | null) => {
        if (node) setIsScrollable(node.scrollHeight > node.clientHeight);
        setCurrent(node);
    }, []);

    useEffect(() => {
        const observer = new ResizeObserver(() => {
            if (current) setIsScrollable(current.scrollHeight > current.clientHeight);
        });
        if (current) Array.from(current.children).forEach((child) => observer.observe(child));
        return () => {
            if (current) Array.from(current.children).forEach((child) => observer.unobserve(child));
            observer.disconnect();
        };
    }, [current]);

    const handleScroll = useCallback(() => {
        const previousScrollTop = previousScrollTopRef.current;

        if (current) {
            const scrollbarTop = Math.abs(
                isInverted ? Math.min(0, current.scrollTop) : Math.max(0, current.scrollTop),
            );
            const scrollbarBottom = current.clientHeight + scrollbarTop;

            const scrollStart = scrollbarTop;
            const scrollEnd = current.scrollHeight - scrollbarBottom;

            const atTop = isInverted ? scrollEnd <= leniency : scrollStart <= leniency;
            const atBottom = isInverted ? scrollStart <= leniency : scrollEnd <= leniency;

            if (atTop) {
                if (
                    atTopCallback &&
                    (!onlyCallbackOnCorrectDirectionalScroll ||
                        (isInverted
                            ? previousScrollTop < scrollStart
                            : previousScrollTop > scrollStart))
                ) {
                    atTopCallback();
                }
                isAtTop.current = true;
            } else {
                isAtTop.current = false;
            }

            if (atBottom) {
                if (
                    atBottomCallback &&
                    (!onlyCallbackOnCorrectDirectionalScroll ||
                        (isInverted
                            ? previousScrollTop > scrollStart
                            : previousScrollTop < scrollStart))
                ) {
                    atBottomCallback();
                }
                isAtBottom.current = true;
            } else {
                isAtBottom.current = false;
            }

            previousScrollTopRef.current = scrollStart;
        }
    }, [
        current,
        atTopCallback,
        atBottomCallback,
        isInverted,
        leniency,
        onlyCallbackOnCorrectDirectionalScroll,
        previousScrollTopRef,
    ]);

    useEffect(() => {
        if (current) {
            current.removeEventListener("scroll", handleScroll);
            current.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (current) current.removeEventListener("scroll", handleScroll);
        };
    }, [current, dependencies, handleScroll]);

    useEffect(() => {
        if (current) previousScrollTopRef.current = Math.abs(current.scrollTop);
    }, [current]);

    return {
        isScrollable,
        current,
        refCallback,
        isAtTop: isAtTop.current,
        isAtBottom: isAtBottom.current,
    };
}

export default useScrollableElement;
