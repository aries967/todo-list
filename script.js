const form = document.getElementById("todo-form");
const input = form.querySelector("input");
const list = document.getElementById("todo-list");
let todoList = JSON.parse(localStorage.getItem("todoList")) || {items: [], idCounter: 0};


window.addEventListener("load", () => {
    todoList["items"].forEach(item => addTodoItem(item.id, item.name, item.completed))
})

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (input.value != "") {
        addTodoItem(todoList["idCounter"] + 1, input.value);
        todoList["items"].push({id: todoList["idCounter"]+1, name: input.value, completed: false})
        todoList["idCounter"] += 1;
        storeList();
        input.value = "";
    }
});

const addTodoItem = (id, value, completed=false) => {
    let item = document.createElement("li");
    item.dataset.id = id;
    _createTodoCheckbox(item, completed);
    _createTodoName(item, value);
    _createEditButton(item)
    _createDeleteButton(item);
    list.appendChild(item);
}

const _createDeleteButton = (parent) => {
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "x";
    deleteButton.classList.add("delete-button")
    deleteButton.addEventListener("click", () => {
        parent.remove();
        todoList["items"] = todoList["items"].filter(item => item.id != parent.dataset.id);
        storeList();
    });
    parent.appendChild(deleteButton)
}

const _createTodoName = (parent, value) => {
    let input = document.createElement("input");
    input.value = value;
    input.disabled = true;
    input.classList.add("todo-name");
    parent.appendChild(input);
}

const _createTodoCheckbox = (parent, checked) => {
    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    if (checked) checkbox.checked = true;
    checkbox.addEventListener("change", () => {
        todoList["items"] = todoList["items"].map(item => item.id == parent.dataset.id ? {...item, completed: checkbox.checked} : item);
        storeList();
    })
    parent.appendChild(checkbox);
}

const _createEditButton = (parent) => {
    let button = document.createElement("button");
    let input = parent.querySelector(".todo-name");
    let isEditing = false;
    button.classList.add("edit-button")

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            todoList["items"] = todoList["items"].map(item => item.id == parent.dataset.id ? {...item, name: input.value} : item);
            input.disabled = true;
            isEditing = false;
            button.innerHTML = "EDIT";
            storeList();
        }
    })

    button.addEventListener("click", () => {
        input.disabled = !input.disabled;
        isEditing = !isEditing;
        button.innerHTML = isEditing ? "CANCEL" : "EDIT";
        if (!isEditing) {
            input.value = todoList["items"].filter(item => item.id == parent.dataset.id)[0]["name"];
        }
        if (input.disabled == false) input.focus();
    })

    button.innerHTML = "EDIT";
    parent.appendChild(button);
}

const storeList = () => {
    localStorage.setItem("todoList", JSON.stringify(todoList));
}

