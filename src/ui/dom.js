import { createTodoForm } from './todo-form.js';

export function renderAddTodoForm() {
    const main = document.getElementById('app');

    const fab = document.createElement('button');
    fab.classList.add('add-todo-fab');
    fab.innerHTML = '<span class="material-symbols-outlined">add_2</span>';
    fab.addEventListener('click', () => {
        // createTodoForm().open();
    });

    main.appendChild(fab);
}