import { DateTime } from "luxon";

const isDate = (date: string) => {
    return !Number.isNaN(new Date(date));
};

const formatDate = (date: string) => {
    if (date && isDate(date) && date.length > 0) {
        return DateTime.fromJSDate(new Date(date)).toLocaleString(
            DateTime.DATETIME_SHORT_WITH_SECONDS,
        );
    }
    return "Unknown";
};

export default formatDate;
