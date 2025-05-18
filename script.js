const form = document.getElementById("todo-form");
const input = form.querySelector("input");
const list = document.getElementById("todo-list");
let todoItems = JSON.parse(localStorage.getItem("items")) || [];

window.addEventListener("load", () => {
    todoItems.forEach(item => addTodoItem(item))
})

const addTodoItem = (value) => {
    let item = document.createElement("li");
    item.textContent = value;
    _createDeleteButton(item)
    list.appendChild(item);
}

const _createDeleteButton = (parent) => {
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "x";
    deleteButton.addEventListener("click", () => {
        parent.remove();
        storeList();
    });
    parent.appendChild(deleteButton)
}

const storeList = () => {
    localStorage.setItem("items", JSON.stringify(todoItems));
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (input.value != "") {
        addTodoItem(input.value);
        todoItems.push(input.value)
        storeList(input.value);
        input.value = "";
    }
})