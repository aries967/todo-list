export const TodoForm = class {
    constructor(todoApp) {
        this.todoApp = todoApp;

        this.element = document.getElementById("todo-form");
        this.titleControlElement = document.getElementById("todo-form__title");
        this.descriptionControlElement = document.getElementById("todo-form__description");
        this.openBtnElement = document.getElementById("todo-form__open");
        this.submitBtnElement = document.getElementById("todo-form__submit");
        this.cancelBtnElement = document.getElementById("todo-form__cancel");

        this.element.addEventListener("submit", this.handleSubmit.bind(this));
        this.openBtnElement.addEventListener("click", this.toggleOpenButton.bind(this));
        this.cancelBtnElement.addEventListener("click", this.toggleOpenButton.bind(this));
    }

    getValues() {
        return {
            title: this.titleControlElement.value,
            description: this.descriptionControlElement.value
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        const { title, description } = this.getValues();

        if (title !== "") {
            this.todoApp.addItem(title, description);
            this.clear()
        }
    }

    toggleOpenButton() {
        this.clear();
        this.openBtnElement.dataset.active = this.openBtnElement.dataset.active === "false" ? "true" : "false";
    }

    clear() {
        Array.from(this.element.elements).forEach(el => {
            try {
                el.value = "";
            } catch {}
        })
    }



}