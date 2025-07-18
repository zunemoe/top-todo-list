import { loadProjects, saveProjects, loadTodos, saveTodos } from './storage';
import { createProject } from './project';

let projects = [];

export function initController() {
    console.log('Controller initialized');
    projects = loadProjects() || [];
}

export function getAllProjects() {
    console.log('Fetching all projects');
    return projects;
}

export function addProject({ title, description }) {
    const newProject = createProject({ title, description });
    projects.push(newProject);
    saveProjects(projects);
}

export function deleteProject(projectId) {
    console.log('Deleting project with ID:', projectId);
    projects = projects.filter(project => project.id !== projectId);
    saveProjects(projects);
}

export function findProjectById(projectId) {
    console.log('Finding project by ID:', projectId);
    return projects.find(project => project.id === projectId);
}

export function loadAllTodos() {
    console.log('Loading all todos for all projects');
    return projects.map(project => ({
        ...project,
        todos: loadTodos(project.id),
    }));
}

export function loadProjectTodos(projectId) {
    console.log(`Loading todos for project ID: ${projectId}`);
    return loadTodos(projectId);
}

export function saveProjectTodos(projectId, todos) {
    console.log(`Saving todos for project ID: ${projectId}`);
    saveTodos(projectId, todos);
}

export function addTodoToProject(projectId, todo) {
    console.log(`Adding todo to project ID: ${projectId}`);
    const project = findProjectById(projectId);
    if (!project) return;
    project.todos.push(todo);
    saveProjectTodos(projectId, project.todos);
}

export function deleteTodoFromProject(projectId, todoId) {
    console.log(`Deleting todo with ID: ${todoId} from project ID: ${projectId}`);
    const project = findProjectById(projectId);
    if (!project) return;
    project.todos = project.todos.filter(todo => todo.id !== todoId);
    saveProjectTodos(projectId, project.todos);
}

export function toggleTodoCompleteById(projectId, todoId) {
    console.log(`Toggling completion for todo ID: ${todoId} in project ID: ${projectId}`);
    const project = findProjectById(projectId);
    if (!project) return;
    const todo = project.todos.find(todo => todo.id === todoId);
    if (todo) {
        todo.completed = !todo.completed;
        saveProjectTodos(projectId, project.todos);
    }
}

