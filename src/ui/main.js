import { _loadTodos, findProjectById } from "../app/controller";

export function updateMainContent(projectId = null) {
    let todos = [];
    let title = '';

    const activeProjectId = localStorage.getItem('activeProjectId');

    if (projectId !== null) {
        todos = _loadTodos(projectId);
        const project = findProjectById(projectId);
        title = project ? project.title : '';
        console.log(`Loading todos for project: ${title}`, todos);
    } else {
        switch (activeProjectId) {
            case 'inbox':
                todos = _loadTodos();
                title = 'Inbox';
                console.log('Inbox todos loaded:', todos);
                break;
            case 'today':
                console.log('Loading Today todos');
                title = 'Today';
                break;
            case 'week':
                console.log('Loading This Week todos');
                title = 'This Week';
                break;
            default:
                const project = findProjectById(projectId);
                if (project) {
                    todos = _loadTodos(projectId);
                    title = project.title;
                } 
                break;
        }
    }
    renderMainContent(title, todos);
}

function renderMainContent(title, todos = []) {
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

function renderTodoList(todos = []) {
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