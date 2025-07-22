export function createTodoForm(onSubmit, onCancel) {
    let element = null;
    let viewportHandler = null;

    function render(todo = null) {    
        element = document.createElement('div');
        element.classList.add('todo-form');
        element.innerHTML = `
            <div class="form-handle"></div>
            <form class="form-content">
                <div class="form-row">                
                    ${todo ? `<input class="checkbox" type="checkbox" ${todo.completed ? 'checked' : ''} />` : ''}
                    <input type="text" id="todo-title" class="form-input" name="title" placeholder="What would you like to do?" value="${todo ? todo.title : ''}" required />                
                </div>

                <div class="form-row">    
                    <textarea name="description" id="todo-description" class="form-input" placeholder="Add a description">${todo ? todo.description : ''}</textarea>
                </div>

                <div class="form-buttons">
                    <input type="date" name="due-date" id="due-date" value="${todo ? formatDateForInput(todo.dueDate) : ''}" />
                    <select name="priority" id="todo-priority">
                        <option value="high" ${todo && todo.priority === 'high' ? 'selected' : ''}>High</option>
                        <option value="medium" ${todo && todo.priority === 'medium' ? 'selected' : ''}>Medium</option>
                        <option value="low" ${todo && todo.priority === 'low' ? 'selected' : ''}>Low</option>
                    </select>
                    <button type="submit" class="submit-btn" id="save-todo">
                        <span class="material-symbols-outlined">check</span>
                    </button> 
                </div>
            </form>
        `;

        setupEvents();
        setupKeyboardHandling();

        return element;
    }

    function setupEvents() {
        const form = element.querySelector('todo-form');
        const saveBtn = element.querySelector('#save-todo');

        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleSubmit();
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSubmit();
        });

        element.addEventListener('click', (e) => {
            e.stoppropPropagation(); // Prevent click events from bubbling up to the modal overlay
        });
    }

    function handleSubmit() {
        const formData = getFormData();
        if (validateForm(formData)) onSubmit(formData);
    }

    function getFormData() {
        return {
            title: element.querySelector('#todo-title').value.trim(),
            description: element.querySelector('#todo-description').value.trim(),
            dueDate: element.querySelector('#due-date').value ? new Date(element.querySelector('#due-date').value).toISOString() : null,
            priority: element.querySelector('#todo-priority').value,
            completed: element.querySelector('.checkbox') ? element.querySelector('.checkbox').checked : false,
        };
    }

    function validateForm(data) {
        if (!data.title) {
            showError('Title is required');
            return false;
        }
        return true;
    }

    function showError(message) {
        console.error(message);
        const titleInput = element.querySelector('#todo-title');
        titleInput.classList.add('error');

        setTimeout(() => {
            titleInput.classList.remove('error');
        }, 3000);
    }

    function setupKeyboardHandling() {
        if ('visualViewport' in window) {
            viewportHandler = () => {
                const keyboardHeight = window.innerHeight - window.visualViewport.height;

                if (keyboardHeight > 150) { // Keyboard is visible
                    element.classList.add('keyboard-visible');
                    document.documentElement.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
                } else { // Keyboard is hidden
                    element.classList.remove('keyboard-visible');
                    document.documentElement.style.setProperty('--keyboard-height', '0px');
                }
            };
            window.visualViewport.addEventListener('resize', viewportHandler);
        }
    }

    function focus() {
        const titleInput = element.querySelector('#todo-title');
        if (titleInput) setTimeout(() => titleInput.focus(), 300);
    }

    function cleanup() {
        if (viewportHandler && 'visualViewport' in window) {
            window.visualViewport.removeEventListener('resize', viewportHandler);
        }
        document.documentElement.style.setProperty('--keyboard-height', '0px');
    }

    return { render, focus, cleanup };
}

function formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
}
// export function openForm(type, todo = null) {
//     // type values: 'new-todo', 'edit-todo'
//     console.log('Opening Add Todo Form');

//     const modalOverlay = document.createElement('div');
//     modalOverlay.classList.add('modal-overlay');

//     const todoForm = document.createElement('div');
//     todoForm.classList.add('todo-form');
//     todoForm.innerHTML = `
//         <div class="form-handle"></div>
//         <form class="form-content">
//             <div class="form-row">
//                 <input type="text" id="todo-title" class="form-input" name="title" placeholder="What would you like to do?" required />
//             </div>
//             <div class="form-row">
//                 <textarea name="description" id="todo-description" class="form-input" placeholder="Add a description"></textarea>
//             </div>
//             <div class="form-buttons">                
//                 <input type="date" name="due-date" id="due-date" />
//                 <select name="priority" id="todo-priority">
//                     <option value="high">High</option>                    
//                     <option value="medium">Medium</option>
//                     <option value="low">Low</option>                    
//                 </select>      
//                 <button type="submit" class="submit-btn" id="save-todo">
//                     <span class="material-symbols-outlined">check</span>
//                 </button>                          
//             </div>
//         </form>
//         `; 
        
//         document.body.appendChild(modalOverlay);
//         modalOverlay.appendChild(todoForm);

//         // Setup mobile keyboard handling
//         setupKeyboardHandling(todoForm);
        
//         setupFormEvents(modalOverlay, todoForm);

//         requestAnimationFrame(() => {
//             modalOverlay.classList.add('active');
//             todoForm.classList.add('active');

//             const titleInput = todoForm.querySelector('#todo-title');
//             setTimeout(() => titleInput.focus(), 300);
//         });
// }

// function setupKeyboardHandling(formElement) {
//     // Handle keyboard visibility
//     if ('visualViewport' in window) {
//         window.visualViewport.addEventListener('resize', () => {
//             const keyboardHeight = window.innerHeight - window.visualViewport.height;

//             if (keyboardHeight > 150) { // Keyboard is visible
//                 formElement.classList.add('keyboard-visible');
//                 document.documentElement.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
//             } else { // Keyboard is hidden
//                 formElement.classList.remove('keyboard-visible');
//                 document.documentElement.style.setProperty('--keyboard-height', '0px');
//             }
//         });
//     }
// }

// function setupFormEvents(modalOverlay, formElement) {
//     const saveBtn = document.getElementById('save-todo');

//     saveBtn.addEventListener('click', (e) => {
//         e.preventDefault();
//         saveTodo(modalOverlay, formElement);
//     });

//     modalOverlay.addEventListener('click', (e) => {
//         if (e.target === modalOverlay) {
//             closeTodoForm(modalOverlay, formElement);
//         }
//     });

//     formElement.addEventListener('click', (e) => {
//         e.stopPropagation(); // Prevent click events from bubbling up to the modal overlay
//     });

//     document.addEventListener('keydown', (e) => {
//         if (e.key === 'Escape') {
//             closeTodoForm(modalOverlay, formElement);
//             document.removeEventListener('keydown', this);
//         }
//     });
// }

// function closeTodoForm(modalOverlay, formElement) {
//     modalOverlay.classList.remove('active');
//     formElement.classList.remove('active');

//     setTimeout(() => {
//         modalOverlay.remove();
//         formElement.remove();

//         document.documentElement.style.setProperty('--keyboard-height', '0px');
//     }, 300);
// }

// function saveTodo(modalOverlay, formElement) {
//     const title = document.getElementById('todo-title').value.trim();
//     const description = document.getElementById('todo-description').value.trim();
//     const dueDate = document.getElementById('due-date').value;
//     const priority = document.getElementById('todo-priority').value;

//     const todoData = {
//         title,
//         description,
//         dueDate: dueDate ? new Date(dueDate).toISOString() : null,
//         priority,
//         completed: false
//     };

//     const result = addTodo(todoData);
//     if (result.success) {
//         console.log('Todo added successfully:', result.todo);
//         updateMainContent('inbox'); // Refresh the main content
//     } else {
//         console.error('Error adding todo:', result.message);
//     }

//     closeTodoForm(modalOverlay, formElement);
// }

