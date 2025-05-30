import { relativeDate } from "../functions.js";

export const TodoItem = class {
    constructor(id, title, dueDate, completed, todoApp) {
        this.todoApp = todoApp;
        this.id = id;
        this.title = title;
        this.dueDate = dueDate;
        this.completed = completed;
        this.setItemHTML();
    }

    setItemHTML() {
        this.html = `
        <li class="todo-item" data-id="${this.id}">
            <label>
                <span class="todo-item__checkbox-placeholder" data-completed="false">
                    <i class="fa-solid fa-check"></i>
                </span>
                <input type="checkbox" class="todo-item__checkbox">
            </label>
            <div class="todo-item__data-container">
                <div class="todo-item__title">${this.title}</div>
                <div class="todo-item__due-date" data-value=${this.dueDate}><i class="fa-regular fa-calendar"></i> ${relativeDate(new Date(Date.parse(this.dueDate)))}</div>
            </div>
            <div class="todo-item__actions-container">
                <button class="todo-item__actions-toggle"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                <ul class="todo-item__actions">
                    <li class="todo-item__up"><i class="fa-solid fa-arrow-up"></i> Move Item Up</li>
                    <li class="todo-item__down"><i class="fa-solid fa-arrow-down"></i> Move Item Down</li>
                    <li class="todo-item__edit"><i class="fa-solid fa-pencil"></i> Edit Item</li>
                    <li class="todo-item__delete"><i class="fa-solid fa-trash"></i> Delete Item</li>
                </ul>
            </div>
        </li>
    `;
    }

    setElementSelector(element) {
        this.element = element;
        this.checkboxElement = this.element.querySelector(".todo-item__checkbox")
        this.checkboxElementPlaceholder = this.element.querySelector(".todo-item__checkbox-placeholder");
        this.titleElement = this.element.querySelector(".todo-item__title");
        this.dueDateElement = this.element.querySelector(".todo-item__due-date")
        this.editButton = this.element.querySelector(".todo-item__edit");
        this.actionsToggleButton = this.element.querySelector(".todo-item__actions-toggle")
        this.#delegateClickEvents();
    }

    moveToTodoList() {
        this.todoApp.todoList.appendItem(this);
    }

    moveToTodoListCompleted() {
        this.todoApp.todoListCompleted.appendItem(this);
    }

    edit(title, dueDate) {
        this.title = title;
        this.dueDate = dueDate;
        this.setItemHTML();
    }

    toggleEditMode() {
        this.editButton.textContent = this.editButton.textContent === "EDIT" ? "CANCEL" : "EDIT";
        this.#switchTitleElement();
        this.#switchDueDateElement();
        if (this.editButton.textContent === "EDIT") this.resetValues();
    }

    resetValues() {
        this.titleElement.value = this.todoApp.findItemById(this.id).title;
        this.dueDateElement.innerHTML = `<i class="fa-regular fa-calendar"></i> ` + relativeDate(new Date(Date.parse(this.todoApp.findItemById(this.id).dueDate)));
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

    #switchTitleElement() {
        if (this.titleElement.tagName === "DIV") {
            this.titleElement.outerHTML = `<input type="text" class="todo-item__title" value="${this.titleElement.textContent}" placeholder="Title...">`
        } else {
            this.titleElement.outerHTML = `<span class="todo-item__title">${this.titleElement.value}</span>`;
        }

        this.titleElement = this.element.querySelector(".todo-item__title");
        if (this.titleElement.tagName === "INPUT") this.#bindTitleElementEnterEvent()
        this.titleElement.focus();
    }

    #bindTitleElementEnterEvent() {
        this.titleElement.addEventListener("keydown", (e) => {
            if (e.code === "Enter" && e.currentTarget.value !== "") {
                this.todoApp.editItem(this.id, this.titleElement.value, this.dueDateElement.value)
                this.toggleEditMode()
            }
        })
    }

    #switchDueDateElement() {
        if (this.dueDateElement.tagName === "DIV") {
            const value = this.dueDateElement.dataset.value;
            this.dueDateElement.innerHTML = "";
            this.dueDateElement.outerHTML = this.dueDateElement.outerHTML.replace("div", "input").replace("</input>", "");
            this.dueDateElement = this.element.querySelector(".todo-item__due-date");
            this.dueDateElement.value = value;
            this.dueDateElement.type = "date";
        } else {
            const value = this.dueDateElement.value;
            this.dueDateElement.outerHTML = this.dueDateElement.outerHTML.concat("</input>").replace("input", "div");
            this.dueDateElement = this.element.querySelector(".todo-item__due-date");
            this.dueDateElement.innerHTML = `<i class="fa-regular fa-calendar"></i> ` + relativeDate(new Date(Date.parse(value)));
            console.log(this.dueDateElement.innerHTML)
            this.dueDateElement.dataset.value = value;
        }
    }

    #toggleCheckboxPlaceholder() {
        this.checkboxElementPlaceholder.dataset.completed = this.checkboxElement.checked;
    }

    #delegateClickEvents() {
        this.element.addEventListener("click", this.#handleClick.bind(this), false)
    }

    #toggleActions() {
        this.actionsToggleButton.classList.toggle("todo-item__actions-toggle--active")
    }

    #handleClick(e) {
        console.log(e.target)
        if (e.target.classList.contains("todo-item__checkbox")) {
            this.#toggleCheckboxPlaceholder();
            this.todoApp.completeItem(this.id, this.checkboxElement.checked);
        } else if (e.target.classList.contains("todo-item__edit-confirm")) {
            this.todoApp.editItem(this.id, this.titleElement.value, this.dueDateElement.value);
            this.toggleEditMode();
            this.todoApp.sorter.setSortedItems(this.todoApp.sortChoice);
            this.todoApp.renderList(this.todoApp.sorter.sortedItems);
        } else if (e.target.classList.contains("todo-item__actions-toggle")) {
            this.#toggleActions();
        } else if (e.target.classList.contains("todo-item__up")) {
            this.todoApp.moveItemUp(this.id);
        } else if (e.target.classList.contains("todo-item__down")) {
            this.todoApp.moveItemDown(this.id);
        } else if (e.target.classList.contains("todo-item__edit")) {
            this.toggleEditMode();
        } else if (e.target.classList.contains("todo-item__delete")) {
            this.todoApp.deleteItem(this.id);
        } else if ((e.target.classList.contains("todo-item__data-container") || e.target.classList.contains("todo-item__title") || e.target.classList.contains("todo-item__due-date")) && e.detail === 2 && this.descriptionElement.tagName === "DIV") {
            this.toggleEditMode();
        }
    }
}