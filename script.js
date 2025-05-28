import { TodoApp } from "./classes/TodoApp.js";

const app = new TodoApp();
window.addEventListener("visibilitychange", () => {
    app.storeItemsToLocal();
})