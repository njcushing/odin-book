const createMultilineTextTruncateStyles = (lineCount: number): React.CSSProperties => {
    const lines = Math.floor(lineCount);

    return {
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        WebkitLineClamp: lines,
    };
};

export default createMultilineTextTruncateStyles;
