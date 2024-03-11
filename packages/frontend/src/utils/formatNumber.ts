const formatNumber = (value: number, decimals: number = 2) => {
    if (!+value) return "0";

    const k = 1000;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp"];

    const i = Math.floor(Math.log(value) / Math.log(k));

    return `${parseFloat((value / k ** i).toFixed(dm))}${sizes[i]}`;
};

export default formatNumber;
