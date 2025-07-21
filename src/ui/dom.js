export function renderAddTodoForm() {
    const main = document.getElementById('app');

    const fab = document.createElement('button');
    fab.classList.add('add-todo-fab');
    fab.innerHTML = '<span class="material-symbols-outlined">add</span>';
    fab.addEventListener('click', openTodoForm);

    main.appendChild(fab);
}

function openTodoForm() {
    console.log('Opening Add Todo Form');
}