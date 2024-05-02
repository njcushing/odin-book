export const fromResizeObserverEntry = (
    entry: ResizeObserverEntry,
    setter: React.Dispatch<React.SetStateAction<number>> | undefined = undefined,
): number => {
    const contentHeight = entry.contentRect.height;
    const padding =
        parseFloat(window.getComputedStyle(entry.target).paddingTop) +
        parseFloat(window.getComputedStyle(entry.target).paddingBottom);
    const totalHeight = contentHeight + padding;
    if (setter) setter(totalHeight);
    return totalHeight;
};

export const fromElement = (
    entry: Element,
    setter: React.Dispatch<React.SetStateAction<number>> | undefined = undefined,
) => {
    const contentHeight = entry.clientHeight;
    const padding =
        parseFloat(window.getComputedStyle(entry).paddingTop) +
        parseFloat(window.getComputedStyle(entry).paddingBottom);
    const totalHeight = contentHeight + padding;
    if (setter) setter(totalHeight);
    return totalHeight;
};
