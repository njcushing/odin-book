import { DateTime } from "luxon";

const formatCreationDate = (date: string): string => {
    const inputDate = DateTime.fromISO(date);

    const { day } = inputDate;
    const month = inputDate.monthLong;
    const { year } = inputDate;

    let formattedDay;
    if ((day > 3 && day < 21) || day > 23) formattedDay = `${day}th`;
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

    return `Joined ${formattedDay} ${month}, ${year}`;
};

export default formatCreationDate;
