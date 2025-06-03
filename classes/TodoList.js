import { htmlToElement } from "../functions.js";

/** 
 * A class for the list element
*/
export const TodoList = class {
    /**
     * Select DOM element
     * @param {TodoApp} todoApp - Teh TodoApp instance
     */
    constructor(todoApp) {
        this.todoApp = todoApp;
        this.element = document.getElementById("todo-list");
    }

    /**
     * Convert an html string to an element then append it to the list's DOM element
     * @param {String} html - an html string
     */
    appendHTML(html) {
       const element =  htmlToElement(html)
       this.element.append(element);
    }

    /**
     * Convert an html string to an element then prepend it to the list's DOM element
     * @param {String} html - an html string 
     */
    prependHTML(html) {
        const element = htmlToElement(html);
        this.element.prepend(element);
    }

    /**
     * Append an item's DOM element to the list's DOM element
     * @param {TodoItem} item 
     */
    appendItem(item) {
        this.element.append(item.element);
    }

        /**
     * Prepend an item's DOM element to the list's DOM element
     * @param {TodoItem} item 
     */
    prependItem(item) {
        this.element.prepend(item.element);
    }

    /**
     * Select and return an item element with specified id
     * @param {Number} id - the id of an item
     * @returns {Element} - the item element with the specified id
     */
    getItemSelector(id) {
        return this.element.querySelector(`[data-id="${id}"]`);
    }

    /**
     * Remove all todoitem element from the DOM
     */
    clear() {
        Array.from(this.element.children).forEach(el => {
            if (el.classList.contains("todo-item")) {
                el.remove()
            }
        })
    }
}