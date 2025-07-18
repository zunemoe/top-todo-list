const PROJECTS_KEY = 'projects';

export function loadProjects() {
    console.log('Loading projects from storage');
    try {
        const data = localStorage.getItem(PROJECTS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading projects:', error);
        return [];
    }
}

export function saveProjects(projects) {
    console.log('Saving projects to storage');
    try {
        localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    } catch (error) {
        console.error('Error saving projects:', error);
    }
}

export function loadTodos(projectId) {
    console.log(`Loading todos for project ${projectId} from storage`);
    try {
        const key = `todos_${projectId}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error(`Error loading todos for project ${projectId}:`, error);
        return [];
    }
}

export function saveTodos(projectId, todos) {
    console.log(`Saving todos for project ${projectId} to storage`);
    try {
        const key = `todos_${projectId}`;
        localStorage.setItem(key, JSON.stringify(todos));
    } catch (error) {   
        console.error(`Error saving todos for project ${projectId}:`, error);
    }
}