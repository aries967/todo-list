import { TodoApp } from "./classes/TodoApp.js";

TodoApp.init();
window.addEventListener("visibilitychange", () => {
    TodoApp.storeItemsToLocal();
})