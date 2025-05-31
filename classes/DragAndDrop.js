export const DragAndDrop = class {
    mouseDownedItem;
    mouseDownTimeout;
    draggedItem;
    initX;
    initY;
    index;

    constructor(todoApp) {
        this.todoApp = todoApp;
        this.element = document.getElementById("dnd-container");
    }

    setYCoordinates() {
        this.coordinates = [];
        this.coordinates = this.coordinates.concat(this.todoApp.getItemsMiddleCoordinates());
    }

    bindWindowListeners() {
        window.addEventListener("mousemove", (e) => {
            if (this.mouseDownedItem === undefined) return;
            let x = e.clientX;
            let y = e.clientY;
            if (Math.hypot(x-this.initX, y-this.initY) < 50 && this.draggedItem === undefined) return;
            if (this.todoApp.sortChoice !== "manual") {
                this.todoApp.notification.show("You can't change item sorting on non-manual sort");
                return
            }
            clearTimeout(this.mouseDownTimeout);
            this.draggedItem = this.mouseDownedItem;
            this.todoApp.items = this.todoApp.items.filter(item => item.id !== this.draggedItem.id)
            this.setYCoordinates();
            this.element.append(this.draggedItem.element);
            this.draggedItem.element.style.top = (e.clientY + 10) + "px";
            this.draggedItem.element.style.left = (e.clientX + 10) + "px";
            this.index = this.#getCoordinateIndex(y);
            this.todoApp.resetItemsBorderStyle();
            this.todoApp.setBorderStyleOnItem(this.index);
        }) 

        window.addEventListener("mouseup", () => {
            if (this.draggedItem === undefined || this.mouseDownedItem === undefined) return;
            this.todoApp.insertItemOnIndex(this.index, this.draggedItem);
            this.draggedItem = undefined;
            this.mouseDownedItem = undefined;
            this.coordinates = [];
        })
    }

    #getCoordinateIndex(y) {
        let i = 0;
        for (const yCoor of this.coordinates) {
            if (y <= yCoor) return i;
            i++;
        }
        return i;
    }

    bindItemListeners(items) {
        items.forEach(item => {
            item.element.addEventListener("mousedown", (e) => {
                this.mouseDownedItem = item;
                this.initX = e.clientX;
                this.initY = e.clientY;
                this.mouseDownTimeout = setTimeout(() => {
                    this.mouseDownedItem = undefined;
                }, 350)
            })
        })
    }

    removeActiveItem() {
        this.element.innerHTML = "";
    }

}