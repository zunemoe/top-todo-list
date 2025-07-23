import { createTodoForm } from './todo-form.js';
import { createModal } from '../app/components/modal.js';
import { openTodoForm } from '../app/controller.js';

export function renderAddTodoForm() {
    const main = document.getElementById('app');

    const fab = document.createElement('button');
    fab.classList.add('add-todo-fab');
    fab.innerHTML = '<span class="material-symbols-outlined">add_2</span>';
    fab.addEventListener('click', () => openTodoForm());

    main.appendChild(fab);
}