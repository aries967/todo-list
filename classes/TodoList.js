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

    appendItem(item) {
        this.element.append(item.element);
    }

    getItemSelector(id) {
        return this.element.querySelector(`[data-id="${id}"]`);
    }
}