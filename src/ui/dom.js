import { openForm } from './form-modal.js';

export function renderAddTodoForm() {
    const main = document.getElementById('app');

    const fab = document.createElement('button');
    fab.classList.add('add-todo-fab');
    fab.innerHTML = '<span class="material-symbols-outlined">add_2</span>';
    fab.addEventListener('click', () => {
        openForm('new-todo');
    });

    main.appendChild(fab);
}