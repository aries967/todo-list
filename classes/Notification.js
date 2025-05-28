export const Notification = class {
    constructor() {
        this.element = document.getElementById("notification");
        this.timeout = undefined;
    }

    show(text) {
        if (this.timeout !== undefined) clearTimeout(this.timeout);
        this.element.style.display = "block";
        this.element.innerHTML = text;
        this.timeout = setTimeout(() => {
            this.element.style.display = "none";
        }, 3000);
    }
}