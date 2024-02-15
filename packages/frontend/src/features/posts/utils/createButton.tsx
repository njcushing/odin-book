const createButton = (
    text: string,
    symbol: string,
    cssModuleImport: Record<string, string>,
    className: string,
    onClickHandler: ((event?: React.MouseEvent<HTMLButtonElement>) => void) | null,
) => {
    return (
        <button
            type="button"
            className={cssModuleImport[className]}
            onClick={(e) => {
                if (onClickHandler) onClickHandler(e);
                e.currentTarget.blur();
                e.preventDefault();
            }}
            onMouseLeave={(e) => {
                e.currentTarget.blur();
            }}
        >
            {symbol && symbol.length > 0 && (
                <p className={`material-symbols-rounded ${cssModuleImport["button-symbol"]}`}>
                    {symbol}
                </p>
            )}
            {text}
        </button>
    );
};

export default createButton;
