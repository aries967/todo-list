export const Sorter = class {
    constructor(todoApp) {
        this.element = document.getElementById("todo-sort");
        this.toggleElement = document.getElementById("todo-sort__toggle");
        this.toggleElement.addEventListener("click", this.handleToggle.bind(this));
        this.optionElements = document.querySelectorAll("#todo-sort__options > li");
        this.optionElements.forEach(element => element.addEventListener("click", this.handleSelect.bind(this)))
        this.todoApp = todoApp;
        this.sortedItems = todoApp.items;
    }

    handleSelect(e) {
        this.setSortedItems(e.currentTarget.dataset.value); 
        this.todoApp.sortChoice = e.currentTarget.dataset.value;
        this.toggleElement.innerHTML = '<i class="fa-solid fa-arrow-up-wide-short"></i> ' + e.currentTarget.textContent;  
        this.handleToggle();
        this.storeSortingChoice()
        this.todoApp.renderList(this.sortedItems);
    }

    handleToggle(e) {
        this.toggleElement.dataset.active = this.toggleElement.dataset.active === "false" ? "true" : "false";
    }

    setSort(value) {
        Array.from(this.optionElements).forEach(element => {
            if (element.dataset.value === value) {
                this.toggleElement.innerHTML = '<i class="fa-solid fa-arrow-up-wide-short"></i>' + element.textContent;
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
        localStorage.setItem("sort", this.todoApp.sortChoice);
    }

    getSortingChoice() {
        return localStorage.getItem("sort") || "manual";
    }
}