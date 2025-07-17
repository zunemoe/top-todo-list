export function createProject({ title, description }) {
    return {
        id: crypto.randomUUID(),
        title,
        description,
        todos: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
}