import { htmlToElement } from "../functions.js";

export const TodoList = class {
    constructor(todoApp) {
        this.todoApp = todoApp;
        this.element = document.getElementById("todo-list");
    }

    appendHTML(html) {
       const element =  htmlToElement(html)
       this.element.append(element);
    }

    prependHTML(html) {
        const element = htmlToElement(html);
        this.element.prepend(element);
    }

    appendItem(item) {
        this.element.append(item.element);
    }

    prependItem(item) {
        this.element.prepend(item.element);
    }

    getItemSelector(id) {
        return this.element.querySelector(`[data-id="${id}"]`);
    }

    clear() {
        Array.from(this.element.children).forEach(el => {
            if (el.classList.contains("todo-item")) {
                el.remove()
            }
        })
    }
}