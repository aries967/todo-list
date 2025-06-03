/**
 * A class that control the sorting feature 
 */
export const Sorter = class {
    /**
     * Bind elements to properties, bind events, and initialize sorted items based on value in local storage
     * @param {TodoApp} todoApp - the TodoApp instance 
     */
    constructor(todoApp) {
        this.element = document.getElementById("todo-sort");
        this.toggleElement = document.getElementById("todo-sort__toggle");
        this.toggleElement.addEventListener("click", this.handleToggle.bind(this));
        this.optionElements = document.querySelectorAll("#todo-sort__options > li");
        this.optionElements.forEach(element => element.addEventListener("click", this.handleSelect.bind(this)))
        this.todoApp = todoApp;
        this.sortChoice = this.getSortingChoice();
        this.setSort();
    }

    /**
     * Handle the click event on options
     * @param {PointerEvent} e 
     */
    handleSelect(e) {
        this.sortChoice = e.currentTarget.dataset.value;
        this.setSortedItems(); 
        this.toggleElement.innerHTML = '<i class="fa-solid fa-arrow-up-wide-short"></i> ' + e.currentTarget.textContent;  
        this.handleToggle();
        this.storeSortingChoice()
        this.todoApp.renderList(this.sortedItems);
    }

    /**
     * Handle click event on the toggle element, set data-active attribute 
     */
    handleToggle() {
        this.toggleElement.dataset.active = this.toggleElement.dataset.active === "false" ? "true" : "false";
    }

    /**
     * Change the text on the toggle button based on the current sorting choice
     */
    setSort() {
        Array.from(this.optionElements).forEach(element => {
            if (element.dataset.value === this.sortChoice) {
                this.toggleElement.innerHTML = '<i class="fa-solid fa-arrow-up-wide-short"></i>' + element.textContent;
            }
        });
        this.setSortedItems();
    }

    /**
     * Set sorted items based on current sorting choice. (doesn't change the actual items array);
     */
    setSortedItems() {
        switch (this.sortChoice) {
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

    /**
     * Store sorting choice to local
     */
    storeSortingChoice() {
        localStorage.setItem("sort", this.sortChoice);
    }

    /**
     * Get sorting choice from local
     * @returns {String} - the stored sorting choice, defaults to manual
     */
    getSortingChoice() {
        return localStorage.getItem("sort") || "manual";
    }
}