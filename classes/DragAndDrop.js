import { Notification } from "./Notification.js";
import { Sorter } from "./Sorter.js";
import { TodoApp } from "./TodoApp.js";

/**
 * A class that manages the Drag and Drop feature
 */
export const DragAndDrop = class {
    static element = document.getElementById("dnd-container");
    static mouseDownedItem;
    static mouseDownTimeout;
    static draggedItem;
    static initX;
    static initY;
    static index;

    /**
     * Save the middle coordinates of items to a coordinates property for easier access
     */
    static setYCoordinates() {
        this.coordinates = TodoApp.getItemsMiddleCoordinates();
    }

    /**
     * Bind event necessary for drag and drop to window
     */
    static bindWindowListeners() {
        window.addEventListener("mousemove", this.handleMousemoveAndTouchmove.bind(this))
        window.addEventListener("touchmove", this.handleMousemoveAndTouchmove.bind(this))

        window.addEventListener("mouseup", this.handleMouseupAndTouchend.bind(this))
        window.addEventListener("touchend", this.handleMouseupAndTouchend.bind(this))
    }

    /**
     * Make a todo item dragged, reset coordinates
     */
    static #dragItem() {
        TodoApp.items = TodoApp.items.filter(item => item.id !== this.draggedItem.id)
        this.setYCoordinates();
        this.element.append(this.draggedItem.element);
        document.body.style.cursor = "move";
    }

    /**
     * Find the index of the smallest y-coordinate the given y-coordinate is less of
     * Used this to know the position of mouse relative to the items
     * @param {Number} y - a y-coordinate
     * @returns {Number} - the index
     */
    static #getCoordinateIndex(y) {
        let i = 0;
        for (const yCoor of this.coordinates) {
            if (y <= yCoor) return i;
            i++;
        }
        return i;
    }

    /**
     * Bind event listeners that are used for drag and drop to all items
     * @param {TodoItem[]} items 
     */
    static bindItemListeners(items) {
        items.forEach(item => {
            item.element.addEventListener("touchstart", this.handleItemMousedownAndTouchstart.bind(this))
            item.element.addEventListener("mousedown", this.handleItemMousedownAndTouchstart.bind(this))
        })
    }

    /**
     * Handle the mousemove and touchmove events on window
     * @param {MouseEvent | TouchEvent} e 
     */
    static handleMousemoveAndTouchmove(e) {
        e.preventDefault();
        let x,y;
        if (this.mouseDownedItem === undefined) return;
        if (e.type === "touchmove") {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        } else {
            x = e.clientX;
            y = e.clientY;
        }
        if (Math.hypot(x - this.initX, y - this.initY) >= 50 && this.draggedItem === undefined) {
            clearTimeout(this.mouseDownTimeout)
            if (Sorter.sortChoice !== "manual") {
                Notification.show("You can't change item sorting on non-manual sort");
                return;
            }
            this.draggedItem = this.mouseDownedItem;
            this.#dragItem();
        }
        if (this.draggedItem === undefined) return;
        if (e.type === "touchmove") {
            this.draggedItem.element.style.top = (e.touches[0].clientY + 10) + "px";
            this.draggedItem.element.style.left = (e.touches[0].clientX + 10) + "px";
        } else {
            this.draggedItem.element.style.top = (e.clientY + 10) + "px";
            this.draggedItem.element.style.left = (e.clientX + 10) + "px";
        }
        this.index = this.#getCoordinateIndex(y);
        TodoApp.resetItemsBorderStyle();
        TodoApp.setBorderStyleOnItem(this.index);
    }

    /**
     * Handles the mouseup and touchend events on window
     */
    static handleMouseupAndTouchend() {
        clearTimeout(this.mouseDownTimeout)
        this.mouseDownedItem = undefined;
        if (this.draggedItem === undefined) return;
        TodoApp.insertItemOnIndex(this.index, this.draggedItem);
        document.body.style.cursor = "default";
        this.draggedItem = undefined;
        this.coordinates = [];
    }

    /**
     * Handles the mousedown and touchstart events on todo items
     * @param {MouseEvent | TouchEvent} e 
     */
    static handleItemMousedownAndTouchstart(e) {
        this.mouseDownedItem = TodoApp.findItemById(Number(e.currentTarget.dataset.id));
        if (e.type === "touchstart") {
            this.initX = e.touches[0].clientX;
            this.initY = e.touches[0].clientY;
        } else {
            this.initX = e.clientX;
            this.initY = e.clientY;
        }
        this.mouseDownTimeout = setTimeout(() => {
            if (Sorter.sortChoice !== "manual") {
                Notification.show("You can't change item sorting on non-manual sort");
                clearTimeout(this.mouseDownTimeout);
                return;
            }
            this.draggedItem = this.mouseDownedItem;
            this.#dragItem();
            this.draggedItem.element.style.top = (this.initY + 10) + "px";
            this.draggedItem.element.style.left = (this.initX + 10) + "px";
            this.index = this.#getCoordinateIndex(this.initY);
            TodoApp.resetItemsBorderStyle();
            TodoApp.setBorderStyleOnItem(this.index);
        }, 1000)
    }

}