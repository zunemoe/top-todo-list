import { loadAllTodos, loadProjectTodos, findProjectById } from "../app/controller";

export function updateMainContent(projectId) {
    let todos = [];
    let title = '';

    switch (projectId) {
        case 'inbox':
            todos = loadAllTodos();
            title = 'Inbox';
            console.log('Inbox todos loaded:', todos);
            break;
        case 'today':
            console.log('Loading Today todos');
            title = 'Today';
            // Load today's todos
            break;
        case 'week':
            console.log('Loading This Week todos');
            title = 'This Week';
            // Load this week's todos
            break;
        default:
            const project = findProjectById(projectId);
            if (project) {
                todos = loadProjectTodos(projectId);
                title = project.title;
            }        
    }

    renderMainContent(title, todos);
}

function renderMainContent(title, todos) {
    const main = document.getElementById('main');

    main.innerHTML = `
        <div class="main-header">
            <h2>${title}</h2>
        </div>
        <div class="todos-container">
            ${renderTodoList(todos)}
        </div>
    `;
}

function renderTodoList(todos) {
    if (todos.length === 0) {
        return '<p class="no-todos">No todos yet. Add one to get started!</p>'
    }

    return todos.map(todo => `
        <div class="todo-item ${todo.priority}">
            <input class="checkbox" type="checkbox" ${todo.completed ? 'checked' : ''} />                
            <span class="todo-title">${todo.title}</span>
            <div class="todo-details">
                <p class="todo-description">${todo.description}</p>
                <span class="todo-due-date">${todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : ''}</span>            
            </div>                        
        </div>
        `).join('');
}