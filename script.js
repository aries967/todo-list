const form = document.getElementById("todo-form");
const nameInput = form.querySelector("input[name='task-name']");
const descriptionInput = form.querySelector("textarea[name='task-description']");
const addButton = document.getElementById("add-button");
const cancelButton = form.querySelector("#cancel-button")
const list = document.querySelector(".todo-list")
const listComplete = document.querySelector(".todo-list-completed");
const hideComplete = document.getElementById("hide-complete");
let notificationTimeout;

let todoList = JSON.parse(localStorage.getItem("todoList")) || { items: [], idCounter: 0 };

console.log(list, listComplete)

window.addEventListener("load", () => {
    todoList.items.forEach(item => addTodoItem(item.id, item.name, item.description, item.completed))
});

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (nameInput.value != "") {
        addTodoItem(todoList.idCounter + 1, nameInput.value, descriptionInput.value, completed = false, doer = "user");
        todoList.items.push({ id: todoList.idCounter + 1, name: nameInput.value, description: descriptionInput.value, completed: false })
        todoList.idCounter += 1;
        storeList();
        nameInput.value = "";
        descriptionInput.value = "";
    }
});

hideComplete.addEventListener("click", () => {
    listComplete.classList.toggle("hide-items");
    if (listComplete.classList.contains("hide-items")) {
        hideComplete.innerHTML = "SHOW";
    } else {
        hideComplete.innerHTML = "HIDE";
    }
})

addButton.addEventListener("click", () => {
    if (addButton.dataset.active == "false") {
        addButton.dataset.active = "true";
    } else {
        addButton.dataset.active = "false";
    }
})

cancelButton.addEventListener("click", () => {
    addButton.dataset.active = "false";
})

const addTodoItem = (id, name, description, completed = false, doer = "system") => {
    let item = document.createElement("li");
    item.dataset.id = id;
    _createTodoCheckbox(item, completed);
    let textContainer = document.createElement("div");
    textContainer.classList.add("todo-text-container")
    _createTodoName(textContainer, name);
    _createTodoDescription(textContainer, description);
    item.append(textContainer);
    _createReorderButtons(item);
    _createReorderButtons(item, to = "bottom");
    _createEditButton(item)
    _createDeleteButton(item);

    if (doer === "user") {
        showNotificationPopup(`Task "${name}" has been added`);
    }
    if (completed) listComplete.append(item);
    if (!completed) list.append(item);
}

const _createDeleteButton = (parent) => {
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "x";
    deleteButton.classList.add("delete-button")
    deleteButton.addEventListener("click", () => {
        showNotificationPopup(`Task "${todoList.items.filter(item => item.id == parent.dataset.id)[0].name}" has been deleted`)
        parent.remove();
        todoList.items = todoList.items.filter(item => item.id != parent.dataset.id);
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

const _createTodoDescription = (parent, value) => {
    let div = document.createElement("div");
    div.textContent = value;
    div.classList.add("todo-description");
    parent.appendChild(div);
}

const _createTodoCheckbox = (parent, checked) => {
    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    if (checked) checkbox.checked = true;
    checkbox.addEventListener("change", () => {
        todoList.items = todoList.items.map(item => item.id == parent.dataset.id ? { ...item, completed: checkbox.checked } : item);
        if (checkbox.checked == true) {
            listComplete.append(parent);
        }
        if (checkbox.checked == false) list.append(parent);
        storeList();
    })
    parent.appendChild(checkbox);
}

const _createEditButton = (parent) => {
    let button = document.createElement("button");
    let taskName = parent.querySelector(".todo-name");
    let taskDescription = parent.querySelector(".todo-description");
    let confirmButton = document.createElement("button");
    confirmButton.textContent = "CONFIRM";
    confirmButton.classList.add("confirm-edit-button");
    let isEditing = false;
    button.classList.add("edit-button");

    confirmButton.addEventListener("click", () => {
        todoList.items = todoList.items.map(item => item.id == parent.dataset.id ? {...item, name: taskName.value, description: parent.querySelector(".todo-description").value} : item);
        storeList();
        taskDescription.textContent = parent.querySelector(".todo-description").value;
        taskName.disabled = true;
        parent.querySelector(".todo-description").remove();
        taskName.after(taskDescription);
        isEditing = false;
        button.textContent = "EDIT";
        parent.querySelector(".confirm-edit-button").remove()
    })

    button.addEventListener("click", () => {
        isEditing = !isEditing;
        taskName.disabled = !taskName.disabled;
        button.innerHTML = isEditing ? "CANCEL" : "EDIT";
        if (!isEditing) {
            taskName.value = todoList.items.filter(item => item.id == parent.dataset.id)[0]["name"];
            parent.querySelector(".todo-description").remove();
            taskName.after(taskDescription);
            parent.querySelector(".confirm-edit-button").remove()
        } else {
            let textarea = document.createElement("textarea");
            textarea.classList.add("todo-description");
            textarea.rows = 3;
            textarea.value = taskDescription.textContent;
            taskDescription.after(confirmButton);
            taskDescription.after(textarea);
            taskDescription.remove();
        }
        if (taskName.disabled == false) taskName.focus();
    })

    button.innerHTML = "EDIT";
    parent.appendChild(button);
}

const _createReorderButtons = (parent, to = "top") => {
    let button = document.createElement("button");
    button.classList.add("reorder-button")
    if (to === "top") {
        button.innerHTML = "^"
    } else if (to === "bottom") {
        button.innerHTML = "v"
    }

    button.addEventListener("click", () => {
        console.log(parent, parent.previousSibling)
        let parentCopy = parent.cloneNode(true);
        let index = todoList.items.findIndex((item) => item.id == parent.dataset.id)
        console.log(index)
        if (to === "top" && index !== 0) {
            parent.previousSibling.before(parent);
            let temp = todoList.items[index - 1];
            todoList.items[index - 1] = todoList.items[index];
            todoList.items[index] = temp;
            showNotificationPopup(`Task Reordered`)
            storeList()
        };
        if (to === "bottom" && parent.nextSibling?.tagName == "LI") {
            parent.nextSibling.after(parent);
            let temp = todoList.items[index + 1];
            todoList.items[index + 1] = todoList.items[index];
            todoList.items[index] = temp;
            showNotificationPopup(`Task Reordered`)
            storeList()
        }
    })

    parent.appendChild(button)
}

const showNotificationPopup = (text) => {
    let popup = document.getElementById("notification-popup");
    popup.style.display = "block";
    if (notificationTimeout != undefined) clearTimeout(notificationTimeout)
    popup.innerHTML = text;
    notificationTimeout = setTimeout(() => {
        popup.style.display = "none";
    }, 3000)
}

const storeList = () => {
    localStorage.setItem("todoList", JSON.stringify(todoList));
}

