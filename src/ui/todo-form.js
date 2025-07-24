import { showInputError, clearInputError, formatDateForDisplay, formatDueDate } from "../app/components/utility";
import AirDatepicker from "air-datepicker";
import 'air-datepicker/air-datepicker.css';
import { getAllProjects, updateProject } from "../app/controller";

export function createTodoForm(onSubmit, onCancel) {
    let element = null;
    let viewportHandler = null;
    let datePicker = null;

    function render(todo = null) {
        console.log('Rendering form with todo:', todo);
        console.log('Todo is truthy:', !!todo);
      element = document.createElement("div");
      element.classList.add("todo-form");
      element.innerHTML = `
        <div class="form-handle"></div>
        <form class="form-content">
            <div class="form-row">                
                ${
                  todo
                    ? `<input class="checkbox" type="checkbox" ${
                        todo.completed ? "checked" : ""
                      } />`
                    : ""
                }
                <input type="text" id="todo-title" class="form-input" name="title" 
                       placeholder="What would you like to do?" 
                       value="${todo?.title || ""}" required />                
            </div>

            <div class="form-row">    
                <textarea name="description" id="todo-description" class="form-input" 
                          placeholder="Add a description">${
                            todo?.description || ""
                          }</textarea>
            </div>

            <div class="form-buttons">
                <div class="input-group date-picker">
                    <span class="material-symbols-outlined calendar-icon">calendar_month</span>  
                    <span class="date-display">${formatDateForDisplay(
                      todo?.dueDate
                    )}</span> 
                    <input type="text" name="due-date" id="due-date" 
                           value="${formatDateForDisplay(todo?.dueDate)}"
                           style="display: none;" readonly />                    
                </div>   
                <div class="input-group priority-selector" data-priority="${todo?.priority || "none"}">                                        
                    <div class="priority-options hidden">
                        <button type="button" class="priority-option" data-priority="none">
                            <span class="material-symbols-outlined">flag_2</span>
                        </button>
                        <button type="button" class="priority-option" data-priority="low">
                            <span class="material-symbols-outlined">flag_2</span>
                        </button>
                        <button type="button" class="priority-option" data-priority="medium">
                            <span class="material-symbols-outlined">flag_2</span>
                        </button>
                        <button type="button" class="priority-option" data-priority="high">
                            <span class="material-symbols-outlined">flag_2</span>
                        </button>
                    </div>
                    <span class="material-symbols-outlined priority-icon">flag_2</span>
                </div>  
                
                <div class="input-group project-selector" id="project-selector">
                    <span class="material-symbols-outlined project-icon">tag</span>
                    <span class="project-display" id="project-display"></span>
                    <div class="project-dropdown" id="project-dropdown">
                    </div>
                </div>
                                          
                <button type="submit" class="submit-btn" id="save-todo">
                    <span class="material-symbols-outlined">check</span>
                </button> 
            </div>
        </form>
    `;

      setupEvents();
      setupKeyboardHandling();
      setupAirDatePicker(todo);
      setupPrioritySelector(todo);
      setupProjectSelector(todo);

      return element;
    }

    function setupProjectSelector(todo) {
        const projectSelector = element.querySelector('#project-selector');
        const projectDisplay = element.querySelector('#project-display');
        const projectDropdown = element.querySelector('#project-dropdown');

        if (!projectSelector) return;

        const selectedProjectId = todo?.projectId || null;
        populateProjectDropdown(selectedProjectId);

        projectSelector.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleProjectDropdown();
        });

        document.addEventListener('click', (e) => {
            if (!projectSelector.contains(e.target)) {
                closeProjectDropdown();
            }
        });
    }

    function populateProjectDropdown(selectedProjectId = null) {
        const projectDropdown = element.querySelector('#project-dropdown');
        const projects = getAllProjects();

        const inboxOption = createProjectOption('inbox', 'Inbox', 'inbox', selectedProjectId === 'inbox');
        const projectOptions = projects.map(project =>
            createProjectOption(project.id, project.title, 'folder', selectedProjectId === project.id)
        );

        const clearOption = document.createElement('div');
        clearOption.classList.add('project-option', 'clear');
        clearOption.innerHTML = `
            <span class="material-symbols-outlined">close</span>
            <span>No Project</span>
        `;
        clearOption.addEventListener('click', () => selectProject(null, 'No Project'));

        projectDropdown.innerHTML = '';
        projectDropdown.appendChild(inboxOption);
        projectOptions.forEach(option => projectDropdown.appendChild(option));
        projectDropdown.appendChild(clearOption);

        if (selectedProjectId) {
            const selectedProject = selectedProjectId === 'inbox' ? { title: 'Inbox' } :
            projects.find(p => p.id === selectedProjectId);

            if (selectedProject) updateProjectDisplay(selectedProject.title, true);
        }
    }

    function createProjectOption(id, title, icon, isSelected) {
        const option = document.createElement('div');
        option.classList.add('project-option');
        option.classList.add(id === 'inbox' ? 'inbox' : 'project');

        if (isSelected) option.classList.add('selected');

        option.innerHTML = `
            <span class="material-symbols-outlined">${icon}</span>
            <span>${title}</span>
        `;

        option.addEventListener('click', () => selectProject(id, title));
        return option;
    }

    function selectProject(projectId, projectTitle) {
        const formData = element.querySelector('form');
        formData.dataset.projectId = projectId;

        updateProjectDisplay(projectTitle, !!projectId);

        element.querySelectorAll('.project-option').forEach(option => {
            option.classList.remove('selected');
        });

        if (projectId) {
            const selectedOption = element.querySelector(`.project-option[data-id="${projectId}"]`);
            if (selectedOption) selectedOption.classList.add('selected');
        }

        closeProjectDropdown();
        console.log(`Selected project: ${projectTitle} (ID: ${projectId})`);
    }

    function updateProjectDisplay(title, hasProject) {
        const projectSelector = element.querySelector('#project-selector');
        const projectDisplay = element.querySelector('#project-display');

        if (hasProject) {
            projectDisplay.textContent = title;
            projectSelector.classList.add('has-project');
            projectSelector.setAttribute('data-has-project', 'true');
        } else {
            projectDisplay.textContent = ''; // Clear the display for no project
            projectSelector.classList.remove('has-project');
            projectSelector.setAttribute('data-has-project', 'false');
        }
    }

    function toggleProjectDropdown() {
        const projectDropdown = element.querySelector('#project-dropdown');
        projectDropdown.classList.toggle('active');
    }

    function closeProjectDropdown() {
        const projectDropdown = element.querySelector('#project-dropdown');
        projectDropdown.classList.remove('active');
    }

    function setupPrioritySelector(todo) {
        const prioritySelector = element.querySelector('.priority-selector');
        const priorityIcon = prioritySelector.querySelector('.priority-icon');
        const priorityOptions = prioritySelector.querySelector('.priority-options');
        const priorityButtons = priorityOptions.querySelectorAll('.priority-option');

        if (!prioritySelector) return;

        let isOpen = false;

        prioritySelector.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            togglePriorityOptions();
        });

        priorityButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const selectedPriority = button.getAttribute('data-priority');
                setPriority(selectedPriority);
                closePriorityOptions();
            });
        });

        document.addEventListener('click', (e) => {
            if (isOpen && !prioritySelector.contains(e.target)) closePriorityOptions();
        });

        function togglePriorityOptions() {
            if (isOpen) closePriorityOptions();
            else openPriorityOptions();
        }

        function openPriorityOptions() {
            isOpen = true;
            priorityOptions.classList.remove('hidden');
            prioritySelector.classList.add('active');            
        }

        function closePriorityOptions() {
            isOpen = false;
            priorityOptions.classList.add('hidden');
            prioritySelector.classList.remove('active');
        }

        function setPriority(priority) {
            prioritySelector.setAttribute('data-priority', priority);                 
            updatePriorityVisuals(priority);
        }

        function updatePriorityVisuals(priority) {
            prioritySelector.classList.remove('priority-none', 'priority-low', 'priority-medium', 'priority-high');
            prioritySelector.classList.add(`priority-${priority}`);
        }

        const initialPriority = prioritySelector.getAttribute('data-priority');
        updatePriorityVisuals(initialPriority);
    }

    function setupAirDatePicker(todo) {
        const dateInput = element.querySelector('#due-date');
        const dateGroup = element.querySelector('.date-picker');
        const calendarIcon = dateGroup.querySelector('.calendar-icon');
        const dateDisplay = dateGroup.querySelector('.date-display');

        if (!dateInput || !dateGroup) return;

        datePicker = new AirDatepicker(dateInput, {
          locale: {
            days: [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            months: [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ],
            monthsShort: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            today: "Today",
            clear: "Clear",
            dateFormat: "MM/dd/yyyy",
            firstDay: 0, // Sunday as first day of the week
          },
          dateFormat: "MM/dd/yyyy",
          autoClose: true,
          isMobile: true,
          buttons: ['clear'],    
          onSelect: ({ date, datepicker }) => {
            console.log("Date selected:", date);
            console.log("Datepicker instance:", datepicker);
            updateDateDisplay(dateDisplay, date);
            updateDatePickerState(dateGroup, date);
          }    
        });

        if (todo?.dueDate) {
            const initialDate = new Date(todo.dueDate);
            datePicker.selectDate(initialDate);
            updateDateDisplay(dateDisplay, initialDate, formatDateForDisplay(todo.dueDate));
            updateDatePickerState(dateGroup, initialDate);
        }

        calendarIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            datePicker.show();
        });

        dateGroup.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            datePicker.show();
        });

        updateDatePickerState(dateGroup, datePicker.selectedDates[0]);
    }

    function updateDateDisplay(dateDisplay, selectedDate) {
        if (selectedDate) {
            const dueDateInfo = formatDueDate(selectedDate);
            dateDisplay.textContent = dueDateInfo.text || formatDateForDisplay(selectedDate);
            dateDisplay.classList.add('has-date');

            // ✅ Remove old date classes properly
            const existingClasses = Array.from(dateDisplay.classList);
            existingClasses.forEach(cls => {
                if (cls.startsWith('due-date-')) {
                    dateDisplay.classList.remove(cls);
                }
            });

            // ✅ Add new classes properly (split the string)
            if (dueDateInfo.cssClass) {
                const newClasses = dueDateInfo.cssClass.split(' ').filter(cls => cls.trim());
                newClasses.forEach(cls => dateDisplay.classList.add(cls));
            }
        } else {
            dateDisplay.textContent = '';
            dateDisplay.classList.remove('has-date');
            
            // Remove date classes when no date selected
            const existingClasses = Array.from(dateDisplay.classList);
            existingClasses.forEach(cls => {
                if (cls.startsWith('due-date-')) {
                    dateDisplay.classList.remove(cls);
                }
            });
        }
    }

    function updateDatePickerState(dateGroup, date) {
        if (date) dateGroup.setAttribute('data-has-date', 'true');
        else dateGroup.removeAttribute('data-has-date');
    }
    
    function setupEvents() {
        const form = element.querySelector('form');
        const saveBtn = element.querySelector('#save-todo');
        const checkbox = element.querySelector('.checkbox');

        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleSubmit();
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSubmit();
        });

        if (checkbox) {
            checkbox.addEventListener('change', () => {
                const titleInput = element.querySelector('#todo-title');
                if (checkbox.checked) titleInput.classList.add('strike');
                else titleInput.classList.remove('strike');     
                
                if (onSubmit) {
                    const formData = getFormData();
                    onSubmit(formData);
                }
            });
        }

        element.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent click events from bubbling up to the modal overlay
        });
    }

    function handleSubmit() {
        const formData = getFormData();
        if (validateForm(formData)) onSubmit(formData);
    }

    function getFormData() {
        const selectedDate = datePicker ?.selectedDates[0];
        const prioritySelector = element.querySelector('.priority-selector');
        const priority = prioritySelector?.getAttribute('data-priority');
        return {
            title: element.querySelector('#todo-title').value.trim(),
            description: element.querySelector('#todo-description').value.trim(),
            dueDate: selectedDate ? selectedDate.toISOString() : null,
            priority: priority === 'none' ? null : priority,
            completed: element.querySelector('.checkbox') ? element.querySelector('.checkbox').checked : false,
            projectId: form.dataset.projectId || null,
        };
    }

    function validateForm(data) {
        const titleInput = element.querySelector('#todo-title');
        if (!data.title) {
            showInputError(titleInput);
            return false;
        }
        clearInputError(titleInput);
        return true;
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
        if (datePicker) {
            datePicker.destroy();
            datePicker = null;
        }

        if (viewportHandler && 'visualViewport' in window) {
            window.visualViewport.removeEventListener('resize', viewportHandler);
        }
        document.documentElement.style.setProperty('--keyboard-height', '0px');
    }

    return { render, focus, cleanup };
}

// function formatDateForDisplay(dateString) {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US');
// }
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

