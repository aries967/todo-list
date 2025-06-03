/**
 * A class that manages the Notification feature
 */
export const Notification = class {
    /**
     * Bind element to property and initialize timeout
     */
    constructor() {
        this.element = document.getElementById("notification");
        this.timeout = undefined;
    }

    /**
     * Show notification for 3 seconds
     * @param {String} text - the text to be shown
     */
    show(text) {
        if (this.timeout !== undefined) clearTimeout(this.timeout);
        this.element.style.display = "block";
        this.element.innerHTML = text;
        this.timeout = setTimeout(() => {
            this.element.style.display = "none";
        }, 3000);
    }
}