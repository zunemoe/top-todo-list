import { loadProjects, saveProjects } from './storage';

let projects = [];

export function initController() {
    console.log('Controller initialized');
    projects = loadProjects() || [];
}

export function getAllProjects() {
    console.log('Fetching all projects');
    return projects;
}

export function addProject(project) {
    console.log('Adding new project:', project);
    projects.push(project);
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