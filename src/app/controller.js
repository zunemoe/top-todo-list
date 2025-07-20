import { loadProjects, saveProjects, loadTodos, saveTodos } from './storage';
import { createProject } from './project';

let projects = [];

export function initController() {
    console.log('Controller initialized');
    projects = loadProjects();
    if (!projects || projects.length === 0) {
        projects = generateDummyProjects();
    }
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

function generateDummyProjects() {
    console.log('Generating dummy projects');
    const projectTitles = ['Personal', 'Work', 'Groceries', 'Reading List'];
    const dummyProjects = projectTitles.map(title => createProject({ title }));

    saveProjects(dummyProjects);
    return dummyProjects;
}

export function deleteProject(projectId) {
    try {
        const initialLength = projects.length;
        projects = projects.filter(project => project.id !== projectId);

        if (projects.length === initialLength) return { success: false, message: 'Project not found' };
        saveProjects(projects);
        console.log(`Project with ID ${projectId} deleted successfully`);
        return { success: true, message: 'Project deleted successfully' };
    } catch (error) {
        console.error('Error deleting project:', error);
        return { success: false, message: 'Failed to delete project' };
    }
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

