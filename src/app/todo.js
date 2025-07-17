export function createTodo({
    title,
    description = '',
    dueDate = null,
    priority = 'medium',
    asignee = '',
    checklist = [],
    completed = false,
}) {
    return {
        id: crypto.randomUUID(),
        title,
        description,
        dueDate,
        priority,
        asignee,
        checklist,
        completed,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

