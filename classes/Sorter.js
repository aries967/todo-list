import { TodoApp } from "./TodoApp.js";

/**
 * A class that control the sorting feature 
 */
export const Sorter = class {
    static element = document.getElementById("todo-sort");
    static toggleElement =  document.getElementById("todo-sort__toggle");
    static optionElements = document.querySelectorAll("#todo-sort__options > li");
    static sortChoice;
    static sortedItems;

    static bindClickEvents() {
        this.toggleElement.addEventListener("click", this.handleToggle.bind(this));
        this.optionElements.forEach(element => element.addEventListener("click", this.handleSelect.bind(this)))
    }

    static init() {
        this.sortChoice = this.getSortingChoice();
    }

    /**
     * Handle the click event on options
     * @param {PointerEvent} e 
     */
    static handleSelect(e) {
        this.sortChoice = e.currentTarget.dataset.value;
        this.setSortedItems(); 
        this.toggleElement.innerHTML = '<i class="fa-solid fa-arrow-up-wide-short"></i> ' + e.currentTarget.textContent;  
        this.handleToggle();
        this.storeSortingChoice()
        TodoApp.renderList(this.sortedItems);
    }

    /**
     * Handle click event on the toggle element, set data-active attribute 
     */
    static handleToggle() {
        this.toggleElement.dataset.active = this.toggleElement.dataset.active === "false" ? "true" : "false";
    }

    /**
     * Change the text on the toggle button based on the current sorting choice
     */
    static setSort() {
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
    static setSortedItems() {
        switch (this.sortChoice) {
            case "manual":
                this.sortedItems = TodoApp.items;
                break;
            case "a-z":
                this.sortedItems = TodoApp.items.toSorted((a,b) => {
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
                this.sortedItems = TodoApp.items.toSorted((a,b) => {
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
                this.sortedItems = TodoApp.items.toSorted((a,b) => Date.parse(a.dueDate) - Date.parse(b.dueDate));
                break;
            case "date-desc":
                this.sortedItems = TodoApp.items.toSorted((a,b) => Date.parse(b.dueDate) - Date.parse(a.dueDate));
                break;
        }
    }

    /**
     * Store sorting choice to local
     */
    static storeSortingChoice() {
        localStorage.setItem("sort", this.sortChoice);
    }

    /**
     * Get sorting choice from local
     * @returns {String} - the stored sorting choice, defaults to manual
     */
    static getSortingChoice() {
        return localStorage.getItem("sort") || "manual";
    }
}