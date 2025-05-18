const form = document.getElementById("todo-form");
const input = form.querySelector("input");
const list = document.getElementById("todo-list");

const addTodo = (value) => {
    let item = document.createElement("li");
    let html = `<input type="checkbox" name="" id="">${value}<button>x</button>`;
    item.innerHTML = html;
    list.appendChild(item);
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (input.value != "") {
        addTodo(input.value);
        input.value = ""
    }
})