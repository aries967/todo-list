import { htmlToElement } from "../functions.js";
import { Sorter } from "./Sorter.js";
import { DragAndDrop } from "./DragAndDrop.js";
import { TodoApp } from "./TodoApp.js";

/** 
 * A class for the list element
*/
export const TodoList = class {
    static element = document.getElementById("todo-list");

    /**
     * @param  {...Element} elements
     */
    static appendElements(...elements) {
        this.element.append(...elements);
    }

    /**
     * @param  {...Element} elements
     */
    static prependElements(...elements) {
        this.element.prepend(...elements);
    }

    /**
     * @param  {...Node} children 
     */
    static clearAndFillWithChildren(...children) {
        this.clear();
        this.appendElements(...children);
    }

    /**
     * Remove all todoitem element from the DOM
     */
    static clear() {
        this.element.innerHTML = "";
    }
}