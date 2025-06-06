import { TodoList } from "./TodoList.js";
import { TodoItem } from "./TodoItem.js";
import { Sorter } from "./Sorter.js";
import { dateInYYYYMMDD } from "../functions.js";
import { DragAndDrop } from "./DragAndDrop.js";
import { NewButton } from "./NewButton.js";
import { Actions } from "./Actions.js";
import { DatePicker } from "./DatePicker.js";
import { Notification } from "./Notification.js";

/**
 * A class that manages the whole application.
 */
export const TodoApp = class {
    static items = this.getItemsFromLocal();
    static init() {
        this.items.forEach(item => item.applyEventListener("mousedown", DragAndDrop.handleItemMousedownAndTouchstart.bind(DragAndDrop)));
        this.items.forEach(item => item.applyEventListener("touchstart", DragAndDrop.handleItemMousedownAndTouchstart.bind(DragAndDrop)));
        Sorter.init();
        Sorter.bindClickEvents();
        Sorter.setSort();
        Sorter.setSortedItems();
        NewButton.bindClickEvent();
        Actions.bindClickEvent();
        DatePicker.bindClickEvents();

        TodoList.clearAndFillWithChildren(...Sorter.sortedItems.map(item => item.element));
        DragAndDrop.bindWindowListeners();
    }

    /**
     * 
     * @param {Number} id - the id of an item
     * @returns {TodoItem | undefined}
     */
    static findItemById(id) {
        return this.items.find(item => item.id === id);
    }

    /**
     * Find the index of an item in list, given its id
     * @param {Number} id - the id property of the item
     * @returns {Number} the index of the item or -1 if not found
     */
    static findIndexItemById(id) {
        return this.items.findIndex(item => item.id === id);
    }

    /**
     * Find the index of the first completed item
     * @returns {Number} - the index of the first completed item if exist, or the list length if not
     */
    static findFirstCompletedItemIndex() {
        const index = this.items.findIndex(item => item.completed === true)
        return index === -1 ? this.items.length : index;
    }

    /**
     * Create and add a new item the DOM list
     */
    static addItem() {
        const id = Date.now();
        const item = new TodoItem(id, "", dateInYYYYMMDD(new Date()), false, this);
        TodoList.prependElements(item.element);
        item.element.classList.add("todo-item--new");
        item.toggleEditMode();
    }

    /**
     * Delete an item
     * @param {TodoItem} item 
     */
    static deleteItem(item) {
        Notification.show(`Task "${item.title}" has been deleted`);
        item.element.remove();
        this.items = this.items.filter(i => i.id !== item.id);
    }

    /**
     * Move an item upward in the list by one
     * @param {TodoItem} item 
     */
    static moveItemUp(item) {
        const index = this.findIndexItemById(item.id)
        item.swapWithPreviousSibling();
        this.swapItems(index, index-1);
    }

    /**
     * Move an item downward in the list by one
     * @param {TodoItem} item 
     */
    static moveItemDown(item) {
        const index = this.findIndexItemById(item.id);
        item.swapWithNextSibling();
        this.swapItems(index, index+1);
    }

    /**
     * Swap the items on the specified two index (in the array only, not in the DOM)
     * @param {Number} index1 
     * @param {Number} index2 
     */
    static swapItems(index1, index2) {
        const item1 = this.items[index1]
        const item2 = this.items[index2];
        this.items[index1] = item2;
        this.items[index2] = item1;
    }

    /**
     * Convert and store this.items to local storage
     */
    static storeItemsToLocal() {
        const items = this.items.map(item => ({
            id: item.id,
            title: item.title,
            dueDate: item.dueDate,
            completed: item.completed
        }))

        localStorage.setItem("items", JSON.stringify(items))
    }

    /**
     * Get items from local storage and convert it to Todoitem object
     * @returns {TodoItem[]} - an array of TodoItem(s)
     */
    static getItemsFromLocal() {
        let items = JSON.parse(localStorage.getItem("items")) || [];
        items = items.map(item => new TodoItem(item.id, item.title, item.dueDate, item.completed, this));
        return items
    }

    /**
     * Get the y coordinates of the center of each item in DOM.
     * @returns {Number[]} an array of the y-coordinates
     */
    static getItemsMiddleCoordinates() {
        return this.items.map(item => {
            let rect = item.element.getBoundingClientRect();
            return rect.y + (rect.height / 2);
        })
    }

    /**
     * Set border top style on item at the specified index
     * Set border bottom if index is equal to the number of items
     * Used only for Drag and Drop 
     * @param {Number} index 
     * @returns 
     */
    static setBorderStyleOnItem(index) {
        if (index === this.items.length) {
            this.items[this.items.length-1].element.style.borderBottom = "2px solid black";
            return;
        }

        this.items[index].element.style.borderTop = "2px solid black";
    }

    /**
     * Reset the border top and bottom style of all the items
     * Used to reset the effect of setBorderStyleOnitem
     */
    static resetItemsBorderStyle() {
        this.items.forEach(item => {
            item.element.style.borderBottom = "";
            item.element.style.borderTop = "";
        })
    }

    /**
     * Insert an item (both in DOM and array of objects) at the specified index
     * @param {Number} index - the index to insert the object at
     * @param {Index} item - the TodoItem object
     */
    static insertItemOnIndex(index, item) {
        this.resetItemsBorderStyle();
        this.items.splice(index, 0, item);
        if (index === 0) {
            TodoList.prependElements(item.element);
            return;
        }
        this.items[index-1].element.after(item.element);
    }

    handleWindowClickEvent() {
        window.addEventListener("click");
        
    }
}