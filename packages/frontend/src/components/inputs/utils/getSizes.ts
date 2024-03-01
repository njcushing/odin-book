const getSizes = (
    size: "xs" | "s" | "m" | "l" | "xl",
    element: "label" | "description" | "input" | "counter" | "error",
): { [key: string]: string } => {
    let sizes = { label: {}, description: {}, input: {}, counter: {}, error: {} };
    switch (size) {
        case "xs":
            sizes = {
                label: {
                    fontSize: "0.9rem",
                },
                description: {
                    fontSize: "0.6rem",
                },
                input: {
                    fontSize: "0.9rem",
                },
                counter: {
                    fontSize: "0.6rem",
                },
                error: {
                    fontSize: "0.6rem",
                },
            };
            break;
        case "s":
            sizes = {
                label: {
                    fontSize: "1.2rem",
                },
                description: {
                    fontSize: "0.8rem",
                },
                input: {
                    fontSize: "1.2rem",
                },
                counter: {
                    fontSize: "0.8rem",
                },
                error: {
                    fontSize: "0.8rem",
                },
            };
            break;
        case "l":
            sizes = {
                label: {
                    fontSize: "1.8rem",
                },
                description: {
                    fontSize: "1.2rem",
                },
                input: {
                    fontSize: "1.8rem",
                },
                counter: {
                    fontSize: "1.2rem",
                },
                error: {
                    fontSize: "1.2rem",
                },
            };
            break;
        case "xl":
            sizes = {
                label: {
                    fontSize: "2.1rem",
                },
                description: {
                    fontSize: "1.4rem",
                },
                input: {
                    fontSize: "2.1rem",
                },
                counter: {
                    fontSize: "1.4rem",
                },
                error: {
                    fontSize: "1.4rem",
                },
            };
            break;
        case "m":
        default:
            sizes = {
                label: {
                    fontSize: "1.5rem",
                },
                description: {
                    fontSize: "1.0rem",
                },
                input: {
                    fontSize: "1.5rem",
                },
                counter: {
                    fontSize: "1.0rem",
                },
                error: {
                    fontSize: "1.0rem",
                },
            };
            break;
    }
    return sizes[element];
};

export default getSizes;
