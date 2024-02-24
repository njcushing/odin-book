const formatNumber = (bytes: number, decimals: number = 2) => {
    if (!+bytes) return "0";

    const k = 1000;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / k ** i).toFixed(dm))}${sizes[i]}`;
};

export default formatNumber;
