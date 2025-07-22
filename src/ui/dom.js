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

// function openTodoFormModal() {
//     console.log('Opening todo form modal');
//     const modal = createModal();

//     const todoForm = createTodoForm(
//         (formData) => {
//             console.log('Form submitted with data:', formData);

//             modal.close();
//             todoForm.cleanup();
//         },
//         () => {
//             console.log('Form cancelled');
//             modal.close();
//             todoForm.cleanup();
//         }
//     );

//     const formElement = todoForm.render();
//     modal.open(formElement);
//     todoForm.focus();
// }