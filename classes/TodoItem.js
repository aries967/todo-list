import { htmlToElement, relativeDate } from "../functions.js";

/**
 * A class for each todo items
 */
export const TodoItem = class {
    static template = document.getElementById("todo-item-template");

    /**
     * Initialize item properties, DOM elements, and event listeners
     * @param {Number} id - a unique id 
     * @param {String} title 
     * @param {String} dueDate - a date string in YYYY-MM-DD format 
     * @param {Boolean} completed 
     * @param {TodoApp} todoApp - the TodoApp instance
     */
    constructor(id, title, dueDate, completed, todoApp) {
        this.todoApp = todoApp;
        this.id = id;
        this.title = title;
        this.dueDate = dueDate;
        this.completed = completed;
        this.setElements();
        this.element.addEventListener("click", this.#handleClick.bind(this))
    }

    /**
     * Set DOM elements as properties for easy access
     */
    setElements() {
        this.element = TodoItem.template.content.firstElementChild.cloneNode(true);
        this.element.dataset.id = this.id;
        this.titleElement = this.element.querySelector(".todo-item__title");
        this.titleElement.textContent = this.title;
        this.dueDateElement = this.element.querySelector(".todo-item__due-date");
        this.dueDateElement.innerHTML += relativeDate(new Date(Date.parse(this.dueDate)));
        this.dueDateElement.dataset.value = this.dueDate;
        this.checkboxElement = this.element.querySelector(".todo-item__checkbox");
        if (this.completed) this.checkboxElement.checked = true;
        this.checkboxElementPlaceholder = this.element.querySelector(".todo-item__checkbox-placeholder");
        this.confirmButton = this.element.querySelector(".todo-item__confirm");
        this.cancelButton = this.element.querySelector(".todo-item__cancel");
        this.actionsToggleButton = this.element.querySelector(".todo-item__actions-toggle");
        this.actionsElement = this.element.querySelector(".todo-item__actions");
    }

    /**
     * Edit the properties and DOM element
     * @param {String} title 
     * @param {String} dueDate - a date string in format YYYY-MM-DD 
     */
    edit(title, dueDate) {
        this.title = title;
        this.dueDate = dueDate;
        this.titleElement.textContent = this.title;
        this.dueDateElement.innerHTML = `<i
                                    class="fa-regular fa-calendar"></i>` + relativeDate(new Date(Date.parse(this.dueDate)));
    }

    /**
     * Make item editable / uneditable
     */
    toggleEditMode() {
        this.#toggleConfirmCancel();
        this.#switchTitleElement();
    }

    /**
     * Move the item's DOM element before it's previous sibling (essentially swapping them) 
     */
    swapWithPreviousSibling() {
        this.element.previousSibling.before(this.element);
    }

    /**
     * Move the item's DOM element after it's next sibling (essentially swapping them) 
     */
    swapWithNextSibling() {
        this.element.nextSibling.after(this.element);
    }

    /**
     * Change the title element to an input element, or back to a div element.
     * Rebind the element selector and its events (because of how outerHTML work)
     */
    #switchTitleElement() {
        if (this.titleElement.tagName === "DIV") {
            this.titleElement.outerHTML = `<input type="text" class="todo-item__title" value="${this.title}" placeholder="Title...">`
        } else {
            this.titleElement.outerHTML = `<div class="todo-item__title">${this.title}</div>`;
        }

        this.titleElement = this.element.querySelector(".todo-item__title");
        if (this.titleElement.tagName === "INPUT") this.#bindTitleElementEnterEvent()
        this.titleElement.focus();
        this.titleElement.select();
    }

    /**
     * Make pressing the "Enter" key have the same effect as Confirm button
     */
    #bindTitleElementEnterEvent() {
        this.titleElement.addEventListener("keydown", (e) => {
            if (e.code === "Enter" && e.currentTarget.value !== "") {
                if (this.element.classList.contains("todo-item--new")) this.todoApp.items.unshift(this);
                this.edit(this.titleElement.value, this.dueDateElement.dataset.value)
                this.toggleEditMode()
            }
        })
    }

    /**
     * Hide / show the confirm and cancel button
     * The buttons are used when editing an item
     */
    #toggleConfirmCancel() {
        this.confirmButton.classList.toggle("hide");
        this.cancelButton.classList.toggle("hide");
    }

    /**
     * hide or show the actions buttons (e.g delete, edit, move up and down)
     */
    #toggleActions() {
        this.todoApp.items.forEach(item => {
            if (item.id !== this.id) item.actionsElement.classList.add("hide")
        });
        this.actionsElement.classList.toggle("hide")
    }

    /**
     * Handle click events on item using event delegation
     * @param {PointerEvent} e 
     */
    #handleClick(e) {
        switch (true){
            case (e.target.classList.contains("todo-item__checkbox")):
                this.completed = !this.completed;
                break;
            case (e.target.classList.contains("todo-item__due-date") && this.titleElement.tagName === "INPUT"):
                let rect = e.target.getBoundingClientRect();
                this.todoApp.datePicker.toggle(rect.x + 10, rect.bottom + 5, new Date(Date.parse(this.dueDateElement.dataset.value)), this);
                break;
            case ((e.target.classList.contains("todo-item__confirm") || e.target.parentElement.classList.contains("todo-item__confirm")) && this.titleElement.value !== ""):
                if (this.element.classList.contains("todo-item--new")) this.todoApp.items.unshift(this);
                this.edit(this.titleElement.value, this.dueDateElement.dataset.value);
                this.toggleEditMode();
                break;
            case (e.target.classList.contains("todo-item__cancel") || e.target.parentElement.classList.contains("todo-item__cancel")):
                if (this.element.classList.contains("todo-item--new")) this.element.remove();
                this.edit(this.title, this.dueDate);
                this.toggleEditMode();
                break;
            case (e.target.classList.contains("todo-item__actions-toggle") || e.target.parentElement.classList.contains("todo-item__actions-toggle")):
                this.#toggleActions();
                break;
            case (e.target.classList.contains("todo-item__up")):
                if (this.todoApp.sorter.sortChoice !== "manual") {
                    this.todoApp.notification.show("You can't change item sorting on non-manual sort");
                    return
                }
                this.todoApp.moveItemUp(this);
                this.#toggleActions();
                break;
            case (e.target.classList.contains("todo-item__down")):
                if (this.todoApp.sorter.sortChoice !== "manual"){
                    this.todoApp.notification.show("You can't change item sorting on non-manual sort");
                    return
                }
                this.todoApp.moveItemDown(this);
                this.#toggleActions();
                break;
            case (e.target.classList.contains("todo-item__edit")):
                this.toggleEditMode();
                this.#toggleActions();
                break;
            case (e.target.classList.contains("todo-item__delete")):
                this.todoApp.deleteItem(this);
                this.#toggleActions();
                break;
            case ((e.target.classList.contains("todo-item__data-container") || e.target.classList.contains("todo-item__title") || e.target.classList.contains("todo-item__due-date")) && e.detail === 2 && this.titleElement.tagName === "DIV"):
                this.toggleEditMode();
                break;
        }
    }
}