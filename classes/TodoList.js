import { htmlToElement } from "../functions.js";

/** 
 * A class for the list element
*/
export const TodoList = class {
    static element = document.getElementById("todo-list");

    /**
     * Convert an html string to an element then append it to the list's DOM element
     * @param {String} html - an html string
     */
    static appendHTML(html) {
       const element =  htmlToElement(html)
       this.element.append(element);
    }

    /**
     * Convert an html string to an element then prepend it to the list's DOM element
     * @param {String} html - an html string 
     */
    static prependHTML(html) {
        const element = htmlToElement(html);
        this.element.prepend(element);
    }

    /**
     * Append an item's DOM element to the list's DOM element
     * @param {TodoItem} item 
     */
    static appendItem(item) {
        this.element.append(item.element);
    }

        /**
     * Prepend an item's DOM element to the list's DOM element
     * @param {TodoItem} item 
     */
    static prependItem(item) {
        this.element.prepend(item.element);
    }

    /**
     * Select and return an item element with specified id
     * @param {Number} id - the id of an item
     * @returns {Element} - the item element with the specified id
     */
    static getItemSelector(id) {
        return this.element.querySelector(`[data-id="${id}"]`);
    }

    /**
     * Remove all todoitem element from the DOM
     */
    static clear() {
        this.element.innerHTML = "";
    }
}