import { generateUUID } from "./components/utility"

export function createProject({ title, description }) {
    return {
        id: generateUUID(),
        title,
        todos: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
}