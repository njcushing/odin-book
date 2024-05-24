import { DateTime } from "luxon";

const formatPostDate = (date: string): string => {
    const inputDate = DateTime.fromISO(date);

    const { day } = inputDate;
    const month = inputDate.monthLong;
    const { year } = inputDate;

    let formattedDay;
    if ((day > 3 && day < 21) || day > 23) {
        formattedDay = `${day}th`;
    } else {
        switch (day % 10) {
            case 1:
                formattedDay = `${day}st`;
                break;
            case 2:
                formattedDay = `${day}nd`;
                break;
            case 3:
                formattedDay = `${day}rd`;
                break;
            default:
        }
    }

    const time = DateTime.fromISO(date).toFormat("h:mm a");

    return `Posted ${formattedDay} ${month}, ${year} at ${time}`;
};

export default formatPostDate;
