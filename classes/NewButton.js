import { TodoApp } from "./TodoApp.js";

export const NewButton = class {
  static element = document.getElementById("todo-new");
  static bindClickEvent() {
    this.element.addEventListener("click", TodoApp.addItem.bind(TodoApp));
  }
}