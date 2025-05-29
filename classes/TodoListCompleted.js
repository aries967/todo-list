import { htmlToElement } from "../functions.js";

export const TodoListCompleted = class {
    constructor(todoApp) {
        this.element = document.getElementById("todo-list-completed");
        this.hideBtnElement = document.getElementById("todo-list-completed__hide");
        this.hideBtnElement.addEventListener("click", this.#handleHideButtonClick.bind(this))
        this.todoApp = todoApp;
    }

    appendHTML(html) {
        const element = htmlToElement(html)
        this.element.append(element);
    }

    appendItem(item) {
        this.element.append(item.element);
    }

    getItemSelector(id) {
        return this.element.querySelector(`[data-id="${id}"]`);
    }

    #handleHideButtonClick() {
        this.element.dataset.hide = this.element.dataset.hide === "false" ? "true" : "false";
        this.hideBtnElement.textContent = this.element.dataset.hide === "false" ? "HIDE" : "SHOW";
    }

    clear() {
        Array.from(this.element.children).forEach(el => {
            if (el.classList.contains("todo-item")) {
                el.remove()
            }
        })
    }
}