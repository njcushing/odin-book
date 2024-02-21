const combineParticipantNames = (names: string[], maxNames: number = 3): string => {
    const maxNamesFloored = Math.floor(maxNames);
    if (!Array.isArray(names)) return "";
    if (names.length === 0) return "";
    let combined = "";
    const namesFiltered = names.filter((name) => {
        return typeof name === "string" && name.length > 0;
    });
    if (maxNamesFloored === 0 && namesFiltered.length > 0) {
        return `${namesFiltered.length} participant${namesFiltered.length === 1 ? "" : "s"}`;
    }
    for (let i = 0; i < Math.min(maxNamesFloored, namesFiltered.length); i++) {
        if (i === namesFiltered.length - 1) {
            combined += `${combined !== "" ? " & " : ""}${namesFiltered[i]}`;
            break;
        }
        combined += `${combined !== "" ? ", " : ""}${namesFiltered[i]}`;
        if (i === maxNamesFloored - 1) {
            const nameCountRemaining = namesFiltered.length - 1 - i;
            if (nameCountRemaining > 0) {
                combined += ` & ${nameCountRemaining} other${nameCountRemaining === 1 ? "" : "s"}`;
            }
            break;
        }
    }
    return combined;
};

export default combineParticipantNames;
