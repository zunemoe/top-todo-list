const PROJECTS_KEY = 'projects';
const TODOS_KEY = 'todos';

export function loadProjects() {
    // console.log('Loading projects from storage');
    try {
        const data = localStorage.getItem(PROJECTS_KEY);
        // console.log('Projects loaded:', data);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading projects:', error);
        return [];
    }
}

export function saveProjects(projects) {
    // console.log('Saving projects to storage');
    try {
        localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    } catch (error) {
        console.error('Error saving projects:', error);
    }
}

export function loadTodos(projectId = null) {
    // console.log(`Loading todos for project ${projectId} from storage`);
    try {
        const data = localStorage.getItem(TODOS_KEY);
        if (!data) return [];
        
        const todos = JSON.parse(data);
        if (!projectId) return todos;
        return todos.filter(todo => todo.projectId === projectId);
    } catch (error) {
        console.error(`Error loading todos for project ${projectId}:`, error);
        return [];
    }
}

export function loadTodo(todoId) {
    // console.log(`Loading todo with ID: ${todoId}`);
    try {
        const todos = loadTodos();
        const todo = todos.find(t => t.id === todoId);
        if (!todo) {
            console.warn(`Todo with ID ${todoId} not found`);
            return null;
        }
        return todo;
    } catch (error) {
        console.error(`Error loading todo with ID ${todoId}:`, error);
    }
}

// export function saveTodos(projectId, todos) {
//     // console.log(`Saving todos for project ${projectId} to storage`);
//     try {
//         const key = `todos_${projectId}`;
//         localStorage.setItem(key, JSON.stringify(todos));
//     } catch (error) {   
//         console.error(`Error saving todos for project ${projectId}:`, error);
//     }
// }

export function addTodo(todo) {
    try {
        const existingTodos = loadTodos();
        existingTodos.push(todo);
        localStorage.setItem(TODOS_KEY, JSON.stringify(existingTodos));
    } catch (error) {
        console.error('Error adding todo:', error);
    }
}

export function updateTodo(todoId, updates) {
    try {
        const todos = loadTodos();
        const todoIndex = todos.findIndex(todo => todo.id === todoId);
        if (todoIndex === -1) return;

        todos[todoIndex] = { ...todos[todoIndex], ...updates };
        localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
    } catch (error) {
        console.error('Error updating todo:', error);
    }
}

export function deleteTodo(todoId) {
    try {
        const todos = loadTodos();
        const updatedTodos = todos.filter(todo => todo.id !== todoId);
        localStorage.setItem(TODOS_KEY, JSON.stringify(updatedTodos));
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}