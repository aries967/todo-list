import { dateInYYYYMMDD, dayToMilisecond, isLeapYear, relativeDate } from "../functions.js";

/**
 * A class that manages the behavior of date picker element
 */
export const DatePicker = class {
    static element = document.getElementById("date-picker");
    static monthElement = document.getElementById("date-picker__month");
    static yearElement = document.getElementById("date-picker__year");
    static prevButton = document.getElementById("date-picker__prev");
    static nextButton = document.getElementById("date-picker__next");
    static datesElement = document.getElementById("date-picker__dates");

    static bindClickEvents() { 
        this.datesElement.addEventListener("click", this.handleDateClick.bind(this))
        this.prevButton.addEventListener("click", this.handlePrev.bind(this));
        this.nextButton.addEventListener("click", this.handleNext.bind(this))
    }

    /**
     * Set the content (e.g. month, year, all the dates) of the date picker element from a given date
     * @param {Date} date 
     */
    static setTextContent(date) {
        const longMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        this.monthElement.textContent = longMonths[date.getMonth()];
        this.yearElement.textContent = date.getFullYear();
        const dates = this.getDateNumbers(date.getFullYear(), date.getMonth());
        this.resetDatesElement();
        const fragment = document.createDocumentFragment();
        for (const d of dates) {
            const div = document.createElement("div");
            if (d.getMonth() !== date.getMonth()) div.classList.add("grey-text");
            if (d.getDate() === this.dateNum && d.getMonth() === this.month && d.getFullYear() === this.year) div.classList.add("selected");
            div.textContent = d.getDate();
            div.dataset.value = dateInYYYYMMDD(d);
            fragment.append(div);
        }
        this.datesElement.append(fragment);
    }

    /**
     * Reset the classes for the date number elements
     */
    static resetDatesElement() {
        this.datesElement.innerHTML = "";
    }

    /**
     * Get the dates that would be shown on the date picker calendar
     * @param {Number} year - a year integer
     * @param {Number} month - month index (between 0 and 11)
     * @returns {Date[]} - an array of dates
     */
    static getDates(year, month) {
        let date = new Date(year, month);
        const dates = [];
        let numOfDatesFromPrevMonth;
        if (date.getDay() !== 1) {
            if (date.getDay() === 0) {
                numOfDatesFromPrevMonth = 6
            } else {
                numOfDatesFromPrevMonth = date.getDay() - 1;
            }
        }
        let startDateOfPrevMonth = new Date(date - dayToMilisecond(numOfDatesFromPrevMonth));
        for (let i = 0; i < numOfDatesFromPrevMonth; i++) {
            dates.push(startDateOfPrevMonth);
            startDateOfPrevMonth = new Date(startDateOfPrevMonth.valueOf() + dayToMilisecond(1));
        }

        while (date.getMonth() === month) {
            dates.push(date);
            date = new Date(date.valueOf() + dayToMilisecond(1));
        }

        while (dates.length % 7 !== 0) {
            dates.push(date);
            date = new Date(date.valueOf() + dayToMilisecond(1));
        }
        return dates;
    }

    /**
     * Show the date picker element on top of the specified item
     * Show the date picker element on top of the specified item
     * @param {TodoItem} item 
     */
    static showOnItem(item) {
        const date = new Date(Date.parse(item.dueDateElement.dataset.value));
        this.element.classList.remove("hide");
        let rect = item.dueDateElement.getBoundingClientRect();
        this.element.style.left = (rect.right - 10) + "px";
        this.element.style.top = (rect.bottom) + "px";
        this.currentItem = item;
        this.displayedDate = date;
        this.month = date.getMonth();
        this.year = date.getFullYear();
        this.dateNum = date.getDate();
        this.setTextContent(date);
    }

    /**
     * Hide the datepicker element
     */
    static close() {
        this.element.classList.add("hide");
    }

    /**
     * Handle click event on date numbers elements
     * @param {PointerEvent} e 
     */
    static handleDateClick(e) {
        let date = new Date(Date.parse(e.target.dataset.value));
        this.close();
        this.close();
        this.currentItem.dueDateElement.innerHTML = `<i class="fa-regular fa-calendar"></i> ` + relativeDate(date);
        this.currentItem.dueDateElement.dataset.value = dateInYYYYMMDD(date)
    }

    /**
     * Handle click event on prev button
     */
    static handlePrev() {
        this.displayedDate = new Date(this.displayedDate.getFullYear(), this.displayedDate.getMonth())
        this.displayedDate = new Date(this.displayedDate - dayToMilisecond(1));
        this.setTextContent(this.displayedDate);
    }

    /**
     * Handle click event on next button
     */
    static handleNext() {
        let month = this.displayedDate.getMonth()
        let year = this.displayedDate.getFullYear()
        if (month === 11) {
            year += 1
            month = 0
        } else {
            month += 1
        }
        this.displayedDate = new Date(year, month);
        this.setTextContent(this.displayedDate);
    }
}