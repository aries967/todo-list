/**
 * A class that manages the Notification feature
 */
export const Notification = class {
    static element = document.getElementById("notification");
    static timeout;

    /**
     * Show notification for 3 seconds
     * @param {String} text - the text to be shown
     */
    static show(text) {
        if (this.timeout !== undefined) clearTimeout(this.timeout);
        this.element.style.display = "block";
        this.element.innerHTML = text;
        this.timeout = setTimeout(() => {
            this.element.style.display = "none";
        }, 3000);
    }
}