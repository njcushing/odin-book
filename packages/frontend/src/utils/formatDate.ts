import { DateTime } from "luxon";

const isDate = (date: string) => {
    return !Number.isNaN(new Date(date));
};

const formatDate = (dateString: string) => {
    if (dateString && isDate(dateString)) {
        return DateTime.fromJSDate(new Date(dateString)).toLocaleString(
            DateTime.DATETIME_SHORT_WITH_SECONDS,
        );
    }
    return "Unknown";
};

export default formatDate;
