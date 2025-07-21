export function openForm(type, todo = null) {
    // type values: 'new-todo', 'edit-todo'
    console.log('Opening Add Todo Form');

    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');

    const todoForm = document.createElement('div');
    todoForm.classList.add('todo-form');
    todoForm.innerHTML = `
        <div class="form-handle"></div>
        <form class="form-content">
            <div class="form-row">
                <input type="text" id="todo-title" class="form-input" name="title" placeholder="What would you like to do?" required />
            </div>
            <div class="form-row">
                <textarea name="description" id="todo-description" class="form-input" placeholder="Add a description"></textarea>
            </div>
            <div class="form-buttons">                
                <input type="date" name="due-date" id="due-date" />
                <select name="priority" id="todo-priority">
                    <option value="high">High</option>                    
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>                    
                </select>      
                <button type="submit" class="submit-btn" id="save-todo">
                    <span class="material-symbols-outlined">check</span>
                </button>                          
            </div>
        </form>
        `; 
        
        document.body.appendChild(modalOverlay);
        modalOverlay.appendChild(todoForm);

        // Setup mobile keyboard handling
        setupKeyboardHandling(todoForm);
        
        setupFormEvents(modalOverlay, todoForm);

        requestAnimationFrame(() => {
            modalOverlay.classList.add('active');
            todoForm.classList.add('active');

            const titleInput = todoForm.querySelector('#todo-title');
            setTimeout(() => titleInput.focus(), 300);
        });
}

function setupKeyboardHandling(formElement) {
    // Handle keyboard visibility
    if ('visualViewport' in window) {
        window.visualViewport.addEventListener('resize', () => {
            const keyboardHeight = window.innerHeight - window.visualViewport.height;

            if (keyboardHeight > 150) { // Keyboard is visible
                formElement.classList.add('keyboard-visible');
                document.documentElement.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
            } else { // Keyboard is hidden
                formElement.classList.remove('keyboard-visible');
                document.documentElement.style.setProperty('--keyboard-height', '0px');
            }
        });
    }
}

function setupFormEvents(modalOverlay, formElement) {
    const saveBtn = document.getElementById('save-todo');

    saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        saveTodo(modalOverlay, formElement);
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeTodoForm(modalOverlay, formElement);
        }
    });

    formElement.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent click events from bubbling up to the modal overlay
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeTodoForm(modalOverlay, formElement);
            document.removeEventListener('keydown', this);
        }
    });
}

function closeTodoForm(modalOverlay, formElement) {
    modalOverlay.classList.remove('active');
    formElement.classList.remove('active');

    setTimeout(() => {
        modalOverlay.remove();
        formElement.remove();

        document.documentElement.style.setProperty('--keyboard-height', '0px');
    }, 300);
}

function saveTodo(modalOverlay, formElement) {
    const title = document.getElementById('todo-title').value.trim();
    const description = document.getElementById('todo-description').value.trim();
    const dueDate = document.getElementById('due-date').value;
    const priority = document.getElementById('todo-priority').value;

    const todoData = {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        priority,
        completed: false
    };

    const result = addTodo(todoData);
    if (result.success) {
        console.log('Todo added successfully:', result.todo);
        updateMainContent('inbox'); // Refresh the main content
    } else {
        console.error('Error adding todo:', result.message);
    }

    closeTodoForm(modalOverlay, formElement);
}

