export const DragAndDrop = class {
    activeItem;
    index;

    constructor(todoApp) {
        this.todoApp = todoApp;
        this.element = document.getElementById("dnd-container");
    }

    setYCoordinates() {
        this.coordinates = [];
        this.coordinates = this.coordinates.concat(this.todoApp.getItemsMiddleCoordinates());
        console.log(this.coordinates);
    }

    bindWindowListeners() {
        window.addEventListener("mousemove", (e) => {
            if (this.activeItem === undefined) return;
            this.element.append(this.activeItem.element);
            let x = e.clientX;
            let y = e.clientY;
            this.activeItem.element.style.top = (e.clientY + 10) + "px";
            this.activeItem.element.style.left = (e.clientX + 10) + "px";
            this.index = this.#getCoordinateIndex(y);
            this.todoApp.resetItemsBorderStyle();
            this.todoApp.setBorderStyleOnItem(this.index);
        }) 

        window.addEventListener("mouseup", () => {
            if (this.activeItem === undefined) return;
            this.todoApp.insertItemOnIndex(this.index, this.activeItem);
            this.activeItem = undefined;
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
            item.element.addEventListener("mousedown", () => {
                this.activeItem = item;
                this.todoApp.items = this.todoApp.items.filter(item => item.id !== this.activeItem.id)
                this.setYCoordinates();
            })
        })
    }

    removeActiveItem() {
        this.element.innerHTML = "";
    }

}