import React, { useEffect, useCallback, useRef } from "react";

type Params = {
    ref: React.RefObject<HTMLElement>;
    atTopCallback?: () => unknown;
    atBottomCallback?: () => unknown;
    isInverted?: boolean;
    leniency?: number;
    onlyCallbackOnCorrectDirectionalScroll?: boolean;
};

function useScrollableElement(params: Params, dependencies: unknown[] | undefined = undefined) {
    const {
        ref,
        atTopCallback = null,
        atBottomCallback = null,
        isInverted,
        leniency = 10,
        onlyCallbackOnCorrectDirectionalScroll,
    } = params;

    const isAtTop = useRef<boolean>(false);
    const isAtBottom = useRef<boolean>(false);
    const previousScrollTopRef = useRef<number>(0);

    const handleScroll = useCallback(() => {
        const { current } = ref;
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
        ref,
        atTopCallback,
        atBottomCallback,
        isInverted,
        leniency,
        onlyCallbackOnCorrectDirectionalScroll,
        previousScrollTopRef,
    ]);

    useEffect(() => {
        const scrollElement = ref.current;
        if (scrollElement) {
            scrollElement.removeEventListener("scroll", handleScroll);
            scrollElement.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (scrollElement) scrollElement.removeEventListener("scroll", handleScroll);
        };
    }, [ref, dependencies, handleScroll]);

    useEffect(() => {
        const { current } = ref;
        if (current) previousScrollTopRef.current = Math.abs(current.scrollTop);
    }, [ref]);

    return [isAtTop.current, isAtBottom.current];
}

export default useScrollableElement;
