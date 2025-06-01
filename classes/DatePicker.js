import { dateInYYYYMMDD, dayToMilisecond, isLeapYear, relativeDate } from "../functions.js";

export const DatePicker = class {
    constructor(todoApp) {
        this.todoApp = todoApp;
        this.element = document.getElementById("date-picker");
        this.monthElement = document.getElementById("date-picker__month");
        this.yearElement = document.getElementById("date-picker__year");
        this.prevButton = document.getElementById("date-picker__prev");
        this.nextButton = document.getElementById("date-picker__next");
        this.datesElement = document.getElementById("date-picker__dates");
        Array.from(this.datesElement.children).forEach(child => child.addEventListener("click", this.handleDateClick.bind(this)));
        this.prevButton.addEventListener("click", this.handlePrev.bind(this));
        this.nextButton.addEventListener("click", this.handleNext.bind(this))
    }

    setTextContent(date) {
        const longMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        this.monthElement.textContent = longMonths[date.getMonth()];
        this.yearElement.textContent = date.getFullYear();
        const dates = this.getDates(date.getFullYear(), date.getMonth());
        this.resetDatesElement();
        Array.from(this.datesElement.children).forEach((child, i) => {
            try {
                if (dates[i].getMonth() !== date.getMonth()) child.classList.add("grey-text");
                if (dates[i].getDate() === this.dateNum && dates[i].getMonth() === this.month && dates[i].getFullYear === this.year) child.classList.add("selected");
                child.textContent = dates[i].getDate();
                child.dataset.value = dateInYYYYMMDD(dates[i]);
            } catch {
                child.classList.add("hide");
            }
        })
    }

    resetDatesElement() {
        Array.from(this.datesElement.children).forEach(child => {
            child.className = "";
        })
    }

    getDates(year, month) {
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

    toggle(x, y, date, item) {
        if (item !== undefined) this.currentItem = item;
        if (date !== undefined) {
            this.date = date;
            this.displayedDate = date;
            this.dateNum = date.getDate();
            this.month = date.getMonth();
            this.year = date.getFullYear();
            this.setTextContent(date);
        }
        this.element.classList.toggle("hide");
        this.element.style.top = y + "px";
        this.element.style.left = x + "px";
    }

    handleDateClick(e) {
        let date = new Date(Date.parse(e.currentTarget.dataset.value));
        this.toggle(0, 0, undefined, undefined);
        this.currentItem.dueDateElement.innerHTML = `<i class="fa-regular fa-calendar"></i> ` + relativeDate(date);
        this.currentItem.dueDateElement.dataset.value = dateInYYYYMMDD(date)
    }

    handlePrev() {
        this.displayedDate = new Date(this.displayedDate.getFullYear(), this.displayedDate.getMonth())
        this.displayedDate = new Date(this.displayedDate - dayToMilisecond(1));
        this.setTextContent(this.displayedDate);
    }

    handleNext() {
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