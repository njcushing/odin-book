export const options = () => [
    { name: "default", colour: "#d5ebec" },
    { name: "light", colour: "#fff" },
    { name: "dark", colour: "#242424" },
];

export const optionNames = () => options().map((option) => option.name);

export const setTheme = (theme: string) => {
    if (optionNames().includes(theme)) {
        const root = document.querySelector(":root");
        if (root !== null) root.setAttribute("theme", theme);
    }
};
