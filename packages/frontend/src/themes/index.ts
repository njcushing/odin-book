export const options = () => [
    { name: "default", colour: "#d5ebec" },
    { name: "light", colour: "#fff" },
    { name: "dark", colour: "#242424" },
];

export const optionNames = () => options().map((option) => option.name);

export const setTheme = (theme: string) => {
    let mutableTheme = theme;
    if (optionNames().includes(mutableTheme)) {
        if (mutableTheme === "default") {
            const prefersDarkColorScheme = window.matchMedia("(prefers-color-scheme: dark)");
            mutableTheme = prefersDarkColorScheme.matches ? "dark" : "light";
        }
        const root = document.querySelector(":root");
        if (root !== null) root.setAttribute("theme", mutableTheme);
    }
};

export const saveTheme = (theme: string) => {
    if (optionNames().includes(theme)) {
        localStorage.setItem("odin-book-theme", theme);
    }
};

export const loadTheme = () => {
    const theme = localStorage.getItem("odin-book-theme") || "";
    if (optionNames().includes(theme)) setTheme(theme);
};
