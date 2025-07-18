import { loadAllTodos, loadProjectTodos, saveProjectTodos } from '../app/controller'; 


export function renderTodoList(todos) {
    
}

export function renderInbox() {
    console.log('Rendering inbox');
    const todos = loadAllTodos();
    
    const main = document.getElementById('main');
    if (!main) return;
    main.innerHTML = ''; // Clear existing content

    const todoList = document.createElement('ul');
    todoList.classList.add('todo-list');

}