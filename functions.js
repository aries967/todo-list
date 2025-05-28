export const htmlToElement = (html) => {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content.firstElementChild;
}

export const relativeDate = (date) => {
    const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Now", "Dec"];
    const longDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const dayToMilisecond = (day) => {
        return day * 24 * 3600 * 1000
    }

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
