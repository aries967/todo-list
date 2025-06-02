import { TodoList } from "./TodoList.js";
import { TodoItem } from "./TodoItem.js";
import { Notification } from "./Notification.js";
import { Sorter } from "./Sorter.js";
import { dateInYYYYMMDD } from "../functions.js";
import { DragAndDrop } from "./DragAndDrop.js";
import { DatePicker } from "./DatePicker.js";

export const TodoApp = class {
    constructor() {
        this.items = this.getItemsFromLocal();

        this.element = document.getElementById("todo-app");
        this.newBtnElement = document.getElementById("todo-new");
        this.newBtnElement.addEventListener("click", this.addItem.bind(this));

        this.todoList = new TodoList(this);
        this.sorter = new Sorter(this);
        this.dnd = new DragAndDrop(this);
        this.notification = new Notification();
        this.datePicker = new DatePicker(new Date(2023, 7,12), this);

        this.renderList();
        this.dnd.bindWindowListeners();
    }

    renderList() {
        this.sorter.setSort();
        let items = this.sorter.sortedItems;
        this.todoList.clear();
        items.forEach(item => {
            this.todoList.appendHTML(item.html);
            item.setElementSelector(this.todoList.element.lastElementChild);
            if (item.completed) item.checkItem()
        })
        this.dnd.bindItemListeners(this.items);
    }

    findItemById(id) {
        return this.items.find(item => item.id === id);
    }

    findIndexItemById(id) {
        return this.items.findIndex(item => item.id === id);
    }

    findFirstCompletedItemIndex(id) {
        const index = this.items.findIndex(item => item.completed === true)
        return index === -1 ? this.items.length : index;
    }

    addItem() {
        const id = Date.now();
        const item = new TodoItem(id, "", dateInYYYYMMDD(new Date()), false, this);
        this.todoList.prependHTML(item.html);
        item.setElementSelector(this.todoList.element.firstElementChild);
        item.element.classList.add("todo-item--new");
        item.toggleEditMode();
        this.dnd.bindItemListeners(this.items);
    }

    deleteItem(item) {
        this.notification.show(`Task "${item.title}" has been deleted`);
        item.element.remove();
        this.items = this.items.filter(i => i.id !== item.id);
    }

    moveItemUp(item) {
        const index = this.findIndexItemById(item.id)
        item.swapWithPreviousSibling();
        this.swapItems(index, index-1);
    }

    moveItemDown(item) {
        const index = this.findIndexItemById(item.id);
        item.swapWithNextSibling();
        this.swapItems(index, index+1);
    }

    swapItems(index1, index2) {
        const item1 = this.items[index1]
        const item2 = this.items[index2];
        this.items[index1] = item2;
        this.items[index2] = item1;
    }

    storeItemsToLocal() {
        const items = this.items.map(item => ({
            id: item.id,
            title: item.title,
            dueDate: item.dueDate,
            completed: item.completed
        }))

        localStorage.setItem("items", JSON.stringify(items))
    }

    getItemsFromLocal() {
        let items = JSON.parse(localStorage.getItem("items")) || [];
        items = items.map(item => new TodoItem(item.id, item.title, item.dueDate, item.completed, this));
        return items
    }

    getItemsMiddleCoordinates() {
        return this.items.map(item => {
            let rect = item.element.getBoundingClientRect();
            return rect.y + (rect.height / 2);
        })
    }

    setBorderStyleOnItem(index) {
        if (index === this.items.length) {
            this.items[this.items.length-1].element.style.borderBottom = "2px solid black";
            return;
        }

        this.items[index].element.style.borderTop = "2px solid black";
    }

    resetItemsBorderStyle() {
        this.items.forEach(item => {
            item.element.style.borderBottom = "";
            item.element.style.borderTop = "";
        })
    }

    insertItemOnIndex(index, item) {
        this.items.splice(index, 0, item);
        this.renderList();
        this.dnd.removeActiveItem();
    }
}