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