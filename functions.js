/**
 * Convert html string to element
 * @param {String} html
 * @returns {HTMLElement}
 */
function htmlToElement(html) {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content.firstElementChild;
}

/**
 * Convert date into a relative format
 * @param {Date} date
 * @returns {String} 
 */
function relativeDate(date) {
    const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Now", "Dec"];
    const longDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    const removeTimeFromDate = (date) => {
        return new Date(date.setHours(0, 0, 0, 0));
    }

    const currentDate = removeTimeFromDate(new Date());
    date = removeTimeFromDate(date);

    if (currentDate - date === 0) {
        return "Today"
    } else if (currentDate - date === dayToMilisecond(1) && currentDate - date > 0) {
        return "Yesterday"
    } else if (date - currentDate === dayToMilisecond(1) && date - currentDate > 0) {
        return "Tomorrow"
    } else if (date - currentDate <= dayToMilisecond(6) && date - currentDate > 0) {
        return longDays[date.getDay()];
    } else if (date.getFullYear() === currentDate.getFullYear()) {
        return `${shortMonths[date.getMonth()]} ${date.getDate()}`;
    } else {
        return `${shortMonths[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }
}

/**
 * Convert a date into YYYY-MM-DD format
 * @param {Date} date 
 * @returns {String}
 */
function dateInYYYYMMDD(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, 0)}-${String(date.getDate()).padStart(2, 0)}`;
}

/**
 * Convert day to miliseconds
 * @param {Number} day 
 * @returns {Number}
 */
function dayToMilisecond(day) {
    return day * 24 * 3600 * 1000
}

/**
 * Determine if a year is a leap year
 * @param {Number} year
 * @returns {Boolean}
 */
function isLeapYear(year) {
    return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0)
}

export { htmlToElement, relativeDate, dateInYYYYMMDD, dayToMilisecond, isLeapYear }