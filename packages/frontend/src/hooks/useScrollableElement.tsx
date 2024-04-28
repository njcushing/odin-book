import React, { useState, useEffect } from "react";

type Params = {
    ref: React.RefObject<HTMLElement>;
    atTopCallback?: () => unknown;
    atBottomCallback?: () => unknown;
    isInverted?: boolean;
    leniency?: number;
    onlyCallbackOnCorrectDirectionalScroll?: boolean;
};

function useScrollableElement(params: Params, dependencies: unknown[] = []) {
    const {
        ref,
        atTopCallback = null,
        atBottomCallback = null,
        isInverted,
        leniency = 10,
        onlyCallbackOnCorrectDirectionalScroll,
    } = params;

    const [previousScrollTop, setPreviousScrollTop] = useState<number>(0);
    const [isAtTop, setIsAtTop] = useState<boolean>(false);
    const [isAtBottom, setIsAtBottom] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            const { current } = ref;

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
                    setIsAtTop(true);
                } else {
                    setIsAtTop(false);
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
                    setIsAtBottom(true);
                } else {
                    setIsAtBottom(false);
                }

                setPreviousScrollTop(scrollStart);
            }
        };

        const scrollElement = ref.current;
        if (scrollElement) {
            setPreviousScrollTop(Math.abs(scrollElement.scrollTop));
            ref.current.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (scrollElement) scrollElement.removeEventListener("scroll", handleScroll);
        };
    }, [
        ref,
        atTopCallback,
        atBottomCallback,
        isInverted,
        leniency,
        onlyCallbackOnCorrectDirectionalScroll,
        dependencies,
        previousScrollTop,
    ]);

    return [isAtTop, isAtBottom];
}

export default useScrollableElement;
