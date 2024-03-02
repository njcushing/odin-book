export type Option = {
    text?: string;
    symbol?: string;
    onClickHandler?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
    link?: string;
    highlighted?: boolean;
    style?: React.CSSProperties;
};
