/**
 * A class that manages the Actions element
 */
export const Actions = class {
    /**
     * Bind elements to properties and bind events
     * @param {TodoApp} todoApp - the TodoApp instance
     */
    constructor(todoApp) {
        this.todoApp = todoApp;
        this.element = document.getElementById("actions");
        this.upBtn = document.getElementById("actions__up");
        this.downBtn = document.getElementById("actions__down");
        this.editBtn = document.getElementById("actions__edit");
        this.deleteBtn = document.getElementById("actions__delete");
        this.element.addEventListener("click", this.handleClick.bind(this))
    }

    /**
     * Show the actions element on the specified item
     * @param {TodoItem} item 
     */
    showOnItem(item) {
        this.element.classList.remove("hide");
        let rect = item.actionsToggleButton.getBoundingClientRect();
        this.element.style.left = (rect.left - 140) + "px";
        this.element.style.top = (rect.bottom + 5) + "px";
        this.item = item;
    }

    /**
     * Hide the actions element
     */
    close() {
        this.element.classList.add("hide");
    }

    /**
     * Delegates click event
     * @param {PointerEvent} e 
     */
    handleClick(e) {
        this.close();
        switch(true){
            case (e.target === this.upBtn):
                this.todoApp.moveItemUp(this.item);
                break;
            case (e.target === this.downBtn):
                this.todoApp.moveItemDown(this.item);
                break;
            case (e.target === this.editBtn):
                this.item.toggleEditMode();
                break;
            case (e.target === this.deleteBtn):
                this.todoApp.deleteItem(this.item);
                break;
        }
    }

}