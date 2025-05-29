import { relativeDate } from "../functions.js";

export const TodoItem = class {
    constructor(id, title, description, dueDate, completed, todoApp) {
        this.todoApp = todoApp;
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.completed = completed;
        this.setItemHTML();
    }

    setItemHTML() {
        this.html = `
        <li class="todo-item" data-id=${this.id}>
            <label>
                <span class="todo-item__checkbox-placeholder" data-completed="false">
                    <i class="fa-solid fa-check"></i>
                </span>
                <input type="checkbox" class="todo-item__checkbox">
            </label>
            <div class="todo-item__data-container">
                <input type="text" value="${this.title}" class="todo-item__title" disabled>
                <div class="todo-item__description">${this.description}</div>
                <div class="todo-item__due-date" data-value="${this.dueDate}"><i class="fa-regular fa-calendar"></i> ${relativeDate(new Date(Date.parse(this.dueDate)))}</div>
                <button class="todo-item__edit-confirm hide">CONFIRM</button>
            </div>
            <button class="todo-item__up">^</button>
            <button class="todo-item__down">v</button>
            <button class="todo-item__edit">EDIT</button>
            <button class="todo-item__delete">x</button>
        </li>
    `;
    }

    setElementSelector(element) {
        this.element = element;
        this.checkboxElement = this.element.querySelector(".todo-item__checkbox")
        this.checkboxElementPlaceholder = this.element.querySelector(".todo-item__checkbox-placeholder");
        this.titleElement = this.element.querySelector(".todo-item__title");
        this.descriptionElement = this.element.querySelector(".todo-item__description");
        this.dueDateElement = this.element.querySelector(".todo-item__due-date")
        this.confirmButton = this.element.querySelector(".todo-item__edit-confirm");
        this.editButton = this.element.querySelector(".todo-item__edit");
        this.#delegateClickEvents();
    }

    moveToTodoList() {
        this.todoApp.todoList.appendItem(this);
    }

    moveToTodoListCompleted() {
        this.todoApp.todoListCompleted.appendItem(this);
    }

    edit(title, description, dueDate) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.setItemHTML();
        // this.titleElement.value = title;
        // this.descriptionElement.textContent = description;
        // this.dueDateElement.textContent = relativeDate(new Date(Date.parse(dueDate)));
        // this.dueDateElement.dataset.value = dueDate
    }

    toggleEditMode() {
        this.titleElement.disabled = !this.titleElement.disabled;
        this.editButton.textContent = this.editButton.textContent === "EDIT" ? "CANCEL" : "EDIT";
        this.#switchDueDateElement();
        this.#switchDescriptionElementTag();
        this.#toggleConfirmButton();
        if (this.editButton.textContent === "EDIT") this.resetValues();
    }

    resetValues() {
        this.titleElement.value = this.todoApp.findItemById(this.id).title;
        this.dueDateElement.textContent = relativeDate(new Date(Date.parse(this.todoApp.findItemById(this.id).dueDate)));
    }

    checkItem() {
        this.checkboxElement.checked = true;
        this.#toggleCheckboxPlaceholder();
    }

    swapWithPreviousSibling() {
        this.element.previousSibling.before(this.element);
    }

    swapWithNextSibling() {
        this.element.nextSibling.after(this.element);
    }

    #switchDueDateElement() {
        if (this.dueDateElement.tagName === "DIV") {
            const value = this.dueDateElement.dataset.value;
            this.dueDateElement.innerHTML = "";
            this.dueDateElement.outerHTML = this.dueDateElement.outerHTML.replace("div", "input").replace("</input>", "");
            this.dueDateElement = this.element.querySelector(".todo-item__due-date");
            this.dueDateElement.value = value;
            this.dueDateElement.type = "date";
            console.log(this.dueDateElement)
        } else {
            const value = this.dueDateElement.value;
            this.dueDateElement.outerHTML = this.dueDateElement.outerHTML.concat("</input>").replace("input", "div");
            this.dueDateElement = this.element.querySelector(".todo-item__due-date");
            this.dueDateElement.innerHTML = `<i class="fa-regular fa-calendar"></i> `+ relativeDate(new Date(Date.parse(value)));
            this.dueDateElement.dataset.value = value;
        }
    }

    #switchDescriptionElementTag() {
        if (this.descriptionElement.tagName === "DIV") {
            this.descriptionElement.outerHTML = this.descriptionElement.outerHTML.replaceAll("div", "textarea");
            this.descriptionElement = this.element.querySelector(".todo-item__description")
        } else {
            this.descriptionElement.outerHTML = this.descriptionElement.outerHTML.replaceAll("textarea", "div");
            this.descriptionElement = this.element.querySelector(".todo-item__description")
        }
    }

    #toggleCheckboxPlaceholder() {
        this.checkboxElementPlaceholder.dataset.completed = this.checkboxElement.checked;
    }

    #toggleConfirmButton() {
        this.confirmButton.classList.toggle("hide")
    }

    #delegateClickEvents() {
        this.element.addEventListener("click", this.#handleClick.bind(this), false)
    }

    #handleClick(e) {
        if (e.target.classList.contains("todo-item__checkbox")) {
            this.#toggleCheckboxPlaceholder();
            this.todoApp.completeItem(this.id, this.checkboxElement.checked);
        } else if (e.target.classList.contains("todo-item__edit-confirm")) {
            this.todoApp.editItem(this.id, this.titleElement.value, this.descriptionElement.value, this.dueDateElement.value);
            this.toggleEditMode();
            this.todoApp.sorter.setSortedItems(this.todoApp.sortChoice);
            this.todoApp.renderList(this.todoApp.sorter.sortedItems);
        } else if (e.target.classList.contains("todo-item__up")) {
            this.todoApp.moveItemUp(this.id);
        } else if (e.target.classList.contains("todo-item__down")) {
            this.todoApp.moveItemDown(this.id);
        } else if (e.target.classList.contains("todo-item__edit")) {
            this.toggleEditMode();
        } else if (e.target.classList.contains("todo-item__delete")) {
            this.todoApp.deleteItem(this.id);
        } else if ((e.target.classList.contains("todo-item__data-container") || e.target.classList.contains("todo-item__title") || e.target.classList.contains("todo-item__description") || e.target.classList.contains("todo-item__due-date")) && e.detail === 2 && this.descriptionElement.tagName === "DIV") {
            this.toggleEditMode();
        }
    }
}