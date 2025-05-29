export const TodoForm = class {
    constructor(todoApp) {
        this.todoApp = todoApp;

        this.element = document.getElementById("todo-form");
        this.newBtnElement = document.getElementById("todo-new")
        this.titleControlElement = document.getElementById("todo-form__title");
        this.dueDateControlElement = document.getElementById("todo-form__due-date");
        this.submitBtnElement = document.getElementById("todo-form__submit");
        this.cancelBtnElement = document.getElementById("todo-form__cancel");

        this.element.addEventListener("submit", this.handleSubmit.bind(this));
        this.newBtnElement.addEventListener("click", this.toggleNewButton.bind(this));
        this.cancelBtnElement.addEventListener("click", this.toggleNewButton.bind(this));
    }

    getValues() {
        return {
            title: this.titleControlElement.value,
            dueDate: this.dueDateControlElement.value,
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        const { title, dueDate } = this.getValues();

        if (title !== "") {
            this.todoApp.addItem(title, dueDate);
            this.clear()
        }
    }

    toggleNewButton() {
        this.clear();
        this.element.dataset.active = this.element.dataset.active === "false" ? "true" : "false";
    }

    clear() {
        Array.from(this.element.elements).forEach(el => {
            try {
                el.value = "";
            } catch {}
        })
    }



}