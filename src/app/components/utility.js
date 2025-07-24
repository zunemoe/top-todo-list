import { isToday, isTomorrow, isYesterday, isPast, isFuture, format, isSameYear } from 'date-fns';

/**
 * Format due date with relative words and appropriate styling
 * @param {string|Date} dateInput - The date to format
 * @returns {object} - Object containing formatted text, CSS class, and raw date
 */

export function formatDueDate(dateInput) {
    if (!dateInput) return { text: '', cssClass: '', date: null};

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return { text: 'Invalid date', cssClass: 'due-date-invalid', date: null };

    const now = new Date();
    let text = '';
    let cssClass = 'due-date';

    if (isToday(date)) {
        text = 'Today';
        cssClass += ' due-date-today';
    } else if (isYesterday(date)) {
        text = 'Yesterday';
        cssClass += ' due-date-past';
    } else if (isTomorrow(date)) {
        text = 'Tomorrow';
        cssClass += ' due-date-future';
    } else if (isSameYear(date, now)) {
        text = format(date, 'MMM d');
        cssClass += isPast(date) ? ' due-date-past' : ' due-date-future';
    } else {
        text = format(date, 'MMM d, yyyy');
        cssClass += isPast(date) ? ' due-date-past' : ' due-date-future';
    }

    return {
        text,
        cssClass,
        date,
        isPast: isPast(date),
        isFuture: isFuture(date),
        isToday: isToday(date),        
    };
}

/**
 * Format date for display in form inputs (MM/dd/yyyy format)
 * @param {string|Date} dateInput - The date to format
 * @returns {string} - Formatted date string
 */
export function formatDateForDisplay(dateInput) {
    if (!dateInput) return '';
    
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';

    return format(date, 'MM/dd/yyyy');
}

/**
 * Format date for form submission (ISO string)
 * @param {Date} date - The date object
 * @returns {string} - ISO date string
 */
export function formatDateForSubmission(date) {
    if (!date || !(date instanceof Date)) return null;
    return date.toISOString();
}

export function showInputError(element, message = null) {
    element.classList.add('error');
    element.classList.add('shake');
    element.focus();

    if (message) showErrorMessage(element, message);

    setTimeout(() => { 
        element.classList.remove('shake'); 
    }, 500);

    const clearOnInput = () => {
        clearInputError(element);
        element.removeEventListener('input', clearOnInput);
    };
    element.addEventListener('input', clearOnInput);
}

export function clearInputError(element) {
    element.classList.remove('error');
    element.classList.remove('shake');

    removeErrorMessage(element);
}

function showErrorMessage(element, message) {
    removeErrorMessage(element);
    const errorMsg = document.createElement('span');
    errorMsg.classList.add('error-message');
    errorMsg.textContent = message;
    element.parentElement.insertBefore(errorMsg, element.nextSibling);
}

function removeErrorMessage(element) {
    const existingError = element.parentElement.querySelector('.error-message');
    if (existingError) existingError.remove();
}

/**
 * Sort todos by due date
 * @param {Array} todos - Array of todo objects
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} - Sorted todos array
 */
export function sortTodosByDueDate(todos, order = 'asc') {
    return [...todos].sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return order === 'asc' ? 1 : -1; // No due date goes to end for asc, beginning for desc
        if (!b.dueDate) return order === 'asc' ? -1 : 1; // No due date goes to end for asc, beginning for desc

        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        if (order === 'asc') return dateA - dateB;
        else return dateB - dateA;        
    });
}

/**
 * Sort todos by title alphabetically
 * @param {Array} todos - Array of todo objects
 * @param {string} order - 'asc' (A-Z) or 'desc' (Z-A)
 * @returns {Array} - Sorted todos array
 */
export function sortTodosByTitle(todos, order = 'asc') {
    return [...todos].sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        if (order === 'asc') return titleA.localeCompare(titleB);
        else return titleB.localeCompare(titleA);
    });
}

/**
 * Sort todos by priority
 * @param {Array} todos - Array of todo objects
 * @param {string} order - 'asc' (none to high) or 'desc' (high to none)
 * @returns {Array} - Sorted todos array
 */
export function sortTodosByPriority(todos, order = 'asc') {
    const priorityOrder = {
        none: 0,
        low: 1,
        medium: 2,
        high: 3
    };

    return [...todos].sort((a, b) => {
        const priorityA = priorityOrder[a.priority] || 0;
        const priorityB = priorityOrder[b.priority] || 0;

        if (order === 'asc') return priorityA - priorityB;
        else return priorityB - priorityA;
    });
}

/**
 * Multi-level sorting: completion status, then by custom sort
 * @param {Array} todos - Array of todo objects
 * @param {string} sortBy - 'dueDate', 'title', or 'priority'
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} - Sorted todos array
 */
export function sortTodos(todos, sortBy = 'dueDate', order = 'asc') {
    return [...todos].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1; // Completed todos go to end

        switch (sortBy) {
            case 'dueDate':
                if (!a.dueDate && !b.dueDate) return 0;
                if (!a.dueDate) return order === 'asc' ? 1 : -1;
                if (!b.dueDate) return order === 'asc' ? -1 : 1;

                const dateA = new Date(a.dueDate);
                const dateB = new Date(b.dueDate);
                return order === 'asc' ? dateA - dateB : dateB - dateA;
            case 'title':
                const titleA = (a.title || '').toLowerCase();
                const titleB = (b.title || '').toLowerCase();
                return order === 'asc' 
                    ? titleA.localeCompare(titleB) 
                    : titleB.localeCompare(titleA);
            case 'priority':
                const priorityOrder = { 'none': 0, 'low': 1, 'medium': 2, 'high': 3 };
                const priorityA = priorityOrder[a.priority || 'none'];
                const priorityB = priorityOrder[b.priority || 'none'];
                return order === 'asc' ? priorityA - priorityB : priorityB - priorityA;
            default:
                return 0; // No sorting applied
        }
    })
}

export function sortTodosByCompletion(todos) {
    return [...todos].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1; // Completed todos go to end
        return 0;
    });
}
