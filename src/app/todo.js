export function createTodo({
    title,
    description = '',
    dueDate = null,
    priority = 'medium',
    asignee = '',
    checklist = [],
    completed = false,
    projectId = null,
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString(),
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
        projectId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

export function updateTodo(todo, updates) {
    return { ...todo, ...updates, updatedAt: new Date().toISOString() };
}

export function toggleTodoComplete(todo) {
    return { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() };
}

export function addChecklistItem(todo, item) {
    return { ...todo, checklist: [...todo.checklist, item], updatedAt: new Date().toISOString() };
}

export function removeChecklistItem(todo, itemIndex) {
    const updatedChecklist = todo.checklist.filter((_, index) => index !== itemIndex);
    return { ...todo, checklist: updatedChecklist, updatedAt: new Date().toISOString() };
}

export function toggleChecklistItem(todo, itemId) {
    const updatedChecklist = todo.checklist.map((item, index) => {
        item.id === itemId ? { ...item, completed: !item.completed } : item;
    });
    return updateTodo(todo, { checklist: updatedChecklist }, { updatedAt: new Date().toISOString() });
}

// Utility functions
export function isOverdue(todo) {
    if (!todo.dueDate) return false;
    const due = new Date(todo.dueDate);
    const now = new Date();
    return due < now && !todo.completed;
}

export function isDueToday(todo) {
    if (!todo.dueDate) return false;
    const due = new Date(todo.dueDate);
    const today = new Date();
    return due.toDateString() === today.toDateString() && !todo.completed;
}


