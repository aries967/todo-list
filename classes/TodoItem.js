import { htmlToElement, relativeDate } from "../functions.js";
import { Actions } from "./Actions.js";
import { DatePicker } from "./DatePicker.js";
import { DragAndDrop } from "./DragAndDrop.js";
import { TodoApp } from "./TodoApp.js";

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
        this.id = id;
        this.title = title;
        this.dueDate = dueDate;
        this.completed = completed;
        this.setElementSelectors();
        this.element.addEventListener("click", this.#handleClick.bind(this))
    }

    /**
     * Set DOM elements as properties for easy access
     */
    setElementSelectors() {
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
        this.actionsToggleButton.classList.toggle("hide")
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
        if (this.titleElement.tagName === "INPUT") {
            this.#bindTitleElementEnterEvent()
            this.titleElement.focus();
            this.titleElement.select();
        }
    }

    /**
     * Make pressing the "Enter" key have the same effect as Confirm button
     */
    #bindTitleElementEnterEvent() {
        this.titleElement.addEventListener("keydown", (e) => {
            if (e.code === "Enter" && e.currentTarget.value !== "") {
                if (this.element.classList.contains("todo-item--new")) { TodoApp.items.unshift(this); DragAndDrop.bindItemListeners(TodoApp.items) }
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
        TodoApp.items.forEach(item => {
            if (item.id !== this.id) item.actionsElement.classList.add("hide")
        });
        this.actionsElement.classList.toggle("hide");
    }

    /**
     * Handle click events on item using event delegation
     * @param {PointerEvent} e 
     */
    #handleClick(e) {
        switch (true) {
            case (e.target.classList.contains("todo-item__checkbox")):
                this.completed = !this.completed;
                break;
            case (e.target.classList.contains("todo-item__due-date") && this.titleElement.tagName === "INPUT"):
                DatePicker.showOnItem(this);
                break;
            case ((e.target.classList.contains("todo-item__confirm") || e.target.parentElement.classList.contains("todo-item__confirm")) && this.titleElement.value !== ""):
                if (this.element.classList.contains("todo-item--new")) { TodoApp.items.unshift(this); DragAndDrop.bindItemListeners(TodoApp.items); }
                this.edit(this.titleElement.value, this.dueDateElement.dataset.value);
                this.toggleEditMode();
                break;
            case (e.target.classList.contains("todo-item__cancel") || e.target.parentElement.classList.contains("todo-item__cancel")):
                if (this.element.classList.contains("todo-item--new")) this.element.remove();
                this.edit(this.title, this.dueDate);
                this.toggleEditMode();
                break;
            case (e.target.classList.contains("todo-item__actions-toggle") || e.target.parentElement.classList.contains("todo-item__actions-toggle")):
                if (Actions.element.classList.contains("hide")) {
                    Actions.showOnItem(this)
                } else {
                    Actions.close();
                }
                break;
            case ((e.target.classList.contains("todo-item__data-container") || e.target.classList.contains("todo-item__title") || e.target.classList.contains("todo-item__due-date")) && e.detail === 2 && this.titleElement.tagName === "DIV"):
                this.toggleEditMode();
                break;
        }
    }

    applyEventListener(event, handler) {
        this.element.addEventListener(event, handler)
    }
}