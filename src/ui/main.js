import { _loadTodos, _loadTodayTodos, _loadWeekTodos, findProjectById, toggleTodoCompleteById, openTodoForm } from "../app/controller";
import { formatDueDate } from "../app/components/utility";

export function updateMainContent(projectId = null) {
    let todos = [];
    let title = '';

    const activeProjectId = localStorage.getItem('activeProjectId');
    const targetId = projectId || activeProjectId;

    if (targetId) {
        switch (targetId) {
            case 'inbox':
                todos = _loadTodos();
                title = 'Inbox';
                console.log('Inbox todos loaded:', todos);
                break;
            case 'today':
                console.log('Loading Today todos');
                todos = _loadTodayTodos();
                title = 'Today';
                break;
            case 'week':
                console.log('Loading This Week todos');
                todos = _loadWeekTodos();
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
    } else {
        todos = _loadTodos();
        title = 'Inbox';
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

    setupTodoEventListeners(todos);
}

function renderTodoList(todos = []) {
    if (todos.length === 0) {
        return '<p class="no-todos">No todos yet. Add one to get started!</p>'
    }

    return todos.map(todo => {
        const dueDateInfo = formatDueDate(todo.dueDate);
        return `
        <div class="todo-item ${todo.priority}">
            <input class="checkbox" type="checkbox" ${todo.completed ? 'checked' : ''} />                
            <span class="todo-title ${ todo.completed ? 'strike' : '' }">${todo.title}</span>
            <div class="todo-details">
                <p class="todo-description">${todo.description}</p>
                ${dueDateInfo.text ? `<span class="todo-due-date ${dueDateInfo.cssClass}">${dueDateInfo.text}</span>` : ''}            
            </div>                        
        </div>
        `}).join('');
}

function setupTodoEventListeners(todos) {
    const todoItems = document.querySelectorAll('.todo-item');

    todoItems.forEach((item, index) => {
        const checkbox = item.querySelector('.checkbox');
        const todo = todos[index];

        if (checkbox && todo) {
            checkbox.addEventListener('change', () => {
                toggleTodoCompleteById(todo.id);               
            });

            item.addEventListener('click', (event) => {
                if (event.target === checkbox) return; // Prevent checkbox click from triggering item click
                    // Handle click on the todo item, e.g., open details or edit
                    
                console.log(`Todo clicked: ${todo.title}`);
                openTodoForm(todo);
            });
        }
    });
}