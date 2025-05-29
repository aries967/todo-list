export const Sorter = class {
    constructor(todoApp) {
        this.element = document.getElementById("todo-sort");
        this.element.addEventListener("change", this.handleChange.bind(this));
        this.todoApp = todoApp;
        this.sortedItems = todoApp.items;
    }

    handleChange(e) {
        this.setSortedItems(e.target.value);   
        this.storeSortingChoice()
        this.todoApp.renderList(this.sortedItems);
        this.todoApp.sortChoice = e.target.value;
    }

    setSort(value) {
        Array.from(this.element.options).forEach(option => {
            console.log(option, value)
            if (option.value === value) {
                this.element.selectedIndex = option.index
            }
        });
        this.setSortedItems(value);
    }

    setSortedItems(value) {
        switch (value) {
            case "manual":
                this.sortedItems = this.todoApp.items;
                break;
            case "a-z":
                this.sortedItems = this.todoApp.items.toSorted((a,b) => {
                    if (a.title.toLowerCase() === b.title.toLowerCase()) {
                        return 0
                    } else if (a.title.toLowerCase() < b.title.toLowerCase()) {
                        return -1
                    } else {
                        return 1
                    }
                });
                break;
            case "z-a":
                this.sortedItems = this.todoApp.items.toSorted((a,b) => {
                    if (a.title.toLowerCase() === b.title.toLowerCase()) {
                        return 0
                    } else if (a.title.toLowerCase() < b.title.toLowerCase()) {
                        return 1
                    } else {
                        return -1
                    }
                })
                break;
            case "date-asc":
                this.sortedItems = this.todoApp.items.toSorted((a,b) => Date.parse(a.dueDate) - Date.parse(b.dueDate));
                break;
            case "date-desc":
                this.sortedItems = this.todoApp.items.toSorted((a,b) => Date.parse(b.dueDate) - Date.parse(a.dueDate));
                break;
        }
    }

    storeSortingChoice() {
        localStorage.setItem("sort", this.element.value);
    }

    getSortingChoice() {
        return localStorage.getItem("sort") || "manual";
    }
}