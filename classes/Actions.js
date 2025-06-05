import { TodoApp } from "./TodoApp.js";
/**
 * A class that manages the Actions element
 */
export const Actions = class {
    static element = document.getElementById("actions");
    static upBtn = document.getElementById("actions__up");
    static downBtn = document.getElementById("actions__down");
    static editBtn = document.getElementById("actions__edit");
    static deleteBtn = document.getElementById("actions__delete");
    static item;

    static bindClickEvent() {
        this.element.addEventListener("click", this.handleClick.bind(this))
    }

    /**
     * Show the actions element on the specified item
     * @param {TodoItem} item 
     */
    static showOnItem(item) {
        this.element.classList.remove("hide");
        let rect = item.actionsToggleButton.getBoundingClientRect();
        this.element.style.left = (rect.left - 140) + "px";
        this.element.style.top = (rect.bottom + 5) + "px";
        this.item = item;
    }

    /**
     * Hide the actions element
     */
    static close() {
        this.element.classList.add("hide");
    }

    /**
     * Delegates click event
     * @param {PointerEvent} e 
     */
    static handleClick(e) {
        this.close();
        switch(true){
            case (e.target === this.upBtn):
                TodoApp.moveItemUp(this.item);
                break;
            case (e.target === this.downBtn):
                TodoApp.moveItemDown(this.item);
                break;
            case (e.target === this.editBtn):
                this.item.toggleEditMode();
                break;
            case (e.target === this.deleteBtn):
                TodoApp.deleteItem(this.item);
                break;
        }
    }

}