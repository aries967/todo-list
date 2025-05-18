const form = document.getElementById("todo-form");
const input = form.querySelector("input");
const list = document.getElementById("todo-list");
let todoItems = JSON.parse(localStorage.getItem("items")) || [];


window.addEventListener("load", () => {
    todoItems.forEach(item => addTodoItem(item.id, item.name, item.completed))
})

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (input.value != "") {
        addTodoItem(todoItems.length + 1, input.value);
        todoItems.push({id: todoItems.length + 1, name: input.value, completed: false})
        storeList(input.value);
        input.value = "";
    }
})

const addTodoItem = (id, value, completed=false) => {
    let item = document.createElement("li");
    item.dataset.id = id;
    _createTodoCheckbox(item, completed);
    _createTodoText(item, value);
    _createDeleteButton(item);
    list.appendChild(item);
}

const _createDeleteButton = (parent) => {
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "x";
    deleteButton.addEventListener("click", () => {
        parent.remove();
        todoItems = todoItems.filter(item => item.id != parent.dataset.id);
        storeList();
    });
    parent.appendChild(deleteButton)
}

const _createTodoText = (parent, value) => {
    let span = document.createElement("span");
    let text = document.createTextNode(value);
    span.appendChild(text);
    parent.appendChild(span);
}

const _createTodoCheckbox = (parent, checked) => {
    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    if (checked) checkbox.checked = true;
    checkbox.addEventListener("change", () => {
        todoItems = todoItems.map(item => item.id == parent.dataset.id ? {...item, completed: checkbox.checked} : item);
        storeList();
    })
    parent.appendChild(checkbox);
}

const storeList = () => {
    localStorage.setItem("items", JSON.stringify(todoItems));
}

