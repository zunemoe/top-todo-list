import { deleteProject, updateProject, addProject } from '../app/controller.js';

export function setupSidebarToggle() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const icon = hamburgerMenu.querySelector('.material-symbols-outlined');    
    const sidebar = document.getElementById('sidebar');
    const header = document.querySelector('header');
    
    hamburgerMenu.addEventListener('click', () => {
        console.log('Hamburger menu clicked');
        sidebar.classList.toggle('active');
        icon.classList.add('hide');
        
        setTimeout(() => {
            icon.textContent = sidebar.classList.contains('active') ? 'close' : 'menu';
            icon.classList.remove('hide');
            header.classList.toggle('no-shadow', sidebar.classList.contains('active'));
        }, 200);        
    });
}

export function renderSidebarProjects(projects) {
    const projectList = document.getElementById('project-list');
    projectList.innerHTML = ''; // Clear existing projects

    projects.forEach(project => {
        const li = document.createElement('li');
        li.classList.add('project-item');
        const div = document.createElement('div');
        div.classList.add('project-item-content');
        div.dataset.id = project.id;

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-project-button');
        deleteButton.innerHTML = '<span class="material-symbols-outlined">delete</span>';

        const projectInput = document.createElement('input');
        projectInput.classList.add('project-input');
        projectInput.type = 'text';        
        projectInput.value = project.title;
        projectInput.disabled = true; // Disable input for now
        projectInput.dataset.id = project.id;
        
        const editButton = document.createElement('button');
        editButton.classList.add('edit-project-button');
        editButton.innerHTML = '<span class="material-symbols-outlined">edit</span>';

        div.appendChild(deleteButton);
        div.appendChild(projectInput);
        div.appendChild(editButton);
        li.appendChild(div);
        projectList.appendChild(li);
    });
}

export function setupNavEvents() {
    console.log('Setting up navigation events');

    const sidebarInner = document.querySelector('.sidebar-inner');
    sidebarInner.addEventListener('click', (event) => {
        // Handle edit button clicks
        if (event.target.closest('.edit-project-button')) {
            event.stopPropagation(); // Prevent click from bubbling up
            const projectItem = event.target.closest('.project-item');
            handleProjectEdit(projectItem);
            return;
        }

        // Handle delete button clicks  
        if (event.target.closest('.delete-project-button')) {
            event.stopPropagation(); // Prevent click from bubbling up
            const projectItem = event.target.closest('.project-item');
            handleProjectDelete(projectItem);
            return;
        }

        // Handle project navigation (div or input clicks)
        const projectElement = event.target.closest('.project-item-content[data-id], .project-input[data-id]');
        if (projectElement) {
            const projectId = projectElement.dataset.id || projectElement.closest('.project-item-content').dataset.id;
            console.log(`Project element clicked with ID: ${projectId}`);

            const main = document.getElementById('main');
            main.innerHTML = `<h2>${projectId}</h2><p>Content for ${projectId} project.</p>`;
            return;
        }
        
        const navBtn = event.target.closest('button[data-id]');
        if (navBtn) {
            const projectName = navBtn.dataset.id;
            console.log(`Navigation button clicked for: ${projectName}`);
            const main = document.getElementById('main');
            main.innerHTML = `<h2>${projectName}</h2><p>Content for ${projectName}.</p>`;
            return;
        }
    });

    document.getElementById('new-project-btn').addEventListener('click', () => {
        handleNewProject();        
    });
}

function handleProjectEdit(projectItem) {
    const projectContent = projectItem.querySelector('.project-item-content');
    const projectId = projectContent.dataset.id;    
    const projectInput = projectContent.querySelector('.project-input');
    console.log('Handling project edit for:', projectId);

    const originalTitle = projectInput.value;

    projectContent.classList.add('editing');
    projectInput.disabled = false;
    projectInput.focus();
    projectInput.select();

    // Create Save and Cancel buttons
    const actionButtons = document.createElement('div');
    actionButtons.classList.add('edit-actions');

    const cancelButton = document.createElement('button');
    cancelButton.classList.add('cancel-edit-button');
    cancelButton.innerHTML = '<span class="material-symbols-outlined">close</span>';

    const saveButton = document.createElement('button');
    saveButton.classList.add('save-edit-button');
    saveButton.innerHTML = '<span class="material-symbols-outlined">check</span>';

    actionButtons.appendChild(cancelButton);
    actionButtons.appendChild(saveButton);
    
    projectInput.insertAdjacentElement('afterend', actionButtons);

    // Handle keyboard events
    function handleKeydown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            saveChanges();
        } else if (event.key === 'Escape') {
            event.preventDefault();
            cancelChanges();
        }
    }

    // Save changes function
    function saveChanges() {
        const newTitle = projectInput.value.trim();
        if (newTitle === '') {
            showInputError(projectInput);
            return;
        } else {
            console.log(`Saving project title: ${newTitle}`);
            clearInputError(projectInput);
            // Update project title in the DOM and controller
            const result = updateProject(projectId, { title: newTitle });
            if (result.success) {
                projectInput.value = newTitle;                
                exitEditMode();
            } else {
                showInputError(projectInput);
            }            
        }
    }

    function cancelChanges() {
        projectInput.value = originalTitle; // Reset to original title
        clearInputError(projectInput);
        exitEditMode();
    }

    function exitEditMode() {
        projectContent.classList.remove('editing');
        projectInput.disabled = true;
        actionButtons.remove();
        projectInput.removeEventListener('keydown', handleKeydown);
        saveButton.removeEventListener('click', saveChanges);
        cancelButton.removeEventListener('click', cancelChanges);
    }

    // Attach event listeners
    projectInput.addEventListener('keydown', handleKeydown);
    saveButton.addEventListener('click', saveChanges);
    cancelButton.addEventListener('click', cancelChanges);
}

function handleProjectDelete(projectItem) {    
    const projectContent = projectItem.querySelector('.project-item-content');
    const projectId = projectContent.dataset.id;
    const projectTitle = projectContent.querySelector('.project-input').value;

    if (confirm(`Are you sure you want to delete the project "${projectTitle}"?`)) {    
        const result = deleteProject(projectId);
        if (result.success) {            
            projectItem.remove();
        } else {
            alert(result.message || 'Failed to delete project');            
        }    
    }
}

function handleNewProject() {
    const projectList = document.getElementById('project-list');

    const li = document.createElement('li');
    li.classList.add('project-item');

    // Create div container
    const div = document.createElement('div');
    div.classList.add('project-item-content', 'editing');

    // Create input for new project
    const projectInput = document.createElement('input');
    projectInput.classList.add('project-input');
    projectInput.type = 'text';
    projectInput.placeholder = 'Awesome Project';
    projectInput.disabled = false; // Enable input for new project
    
    // Create action buttons for new project
    const actionButtons = document.createElement('div');
    actionButtons.classList.add('edit-actions');

    const cancelButton = document.createElement('button');
    cancelButton.classList.add('cancel-edit-button');
    cancelButton.innerHTML = '<span class="material-symbols-outlined">close</span>';

    const saveButton = document.createElement('button');
    saveButton.classList.add('save-edit-button');
    saveButton.innerHTML = '<span class="material-symbols-outlined">check</span>';

    actionButtons.appendChild(cancelButton);
    actionButtons.appendChild(saveButton);

    div.appendChild(projectInput);
    li.appendChild(div);
    projectList.appendChild(li);
    projectInput.insertAdjacentElement('afterend', actionButtons);

    projectInput.focus();

    // Handle keyboard events
    function handleKeydown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            saveNewProject();
        } else if (event.key === 'Escape') {
            event.preventDefault();
            cancelNewProject();
        }
    }

    // Save new project function
    function saveNewProject() {
        const title = projectInput.value.trim();
        if (title === '') {
            showInputError(projectInput);
            projectInput.focus();
            return;
        }

        const result = addProject({ title });
        if (result.success) {
            console.log(`New project added: ${title}`);
            updateNewProjectUI(result.data);
        } else {
            showInputError(projectInput);                        
        }
    }

    function updateNewProjectUI(project) {
        div.classList.remove('editing');
        div.dataset.id = project.id; // Set the new project ID
        projectInput.value = project.title; // Set the input value to the new project title        
        projectInput.disabled = true; // Disable input after saving
        projectInput.dataset.id = project.id; // Set the ID for future reference

        actionButtons.remove(); // Remove action buttons after saving

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-project-button');
        deleteButton.innerHTML = '<span class="material-symbols-outlined">delete</span>';

        // Create edit button
        const editButton = document.createElement('button');
        editButton.classList.add('edit-project-button');
        editButton.innerHTML = '<span class="material-symbols-outlined">edit</span>';

        // Rearrange elements in the correct order: delete | input | edit
        div.insertBefore(deleteButton, projectInput);
        div.appendChild(editButton);

        // Remove the event listeners from previous buttons
        projectInput.removeEventListener('keydown', handleKeydown);
        saveButton.removeEventListener('click', saveNewProject);
        cancelButton.removeEventListener('click', cancelNewProject);
    }

    function cancelNewProject() {
        projectInput.value = ''; // Reset input
        li.remove(); // Remove the new project item
    }

    projectInput.addEventListener('keydown', handleKeydown);
    saveButton.addEventListener('click', saveNewProject);
    cancelButton.addEventListener('click', cancelNewProject);
}

function showInputError(inputElement) {
    inputElement.classList.add('error');
    inputElement.classList.add('shake');
    inputElement.focus();

    setTimeout(() => {     
        inputElement.classList.remove('shake');
    }, 500);

    const clearOnInput = () => {
        clearInputError(inputElement);
        inputElement.removeEventListener('input', clearOnInput);
    }
    inputElement.addEventListener('input', clearOnInput);
}

function clearInputError(inputElement) {
    inputElement.classList.remove('error');
    inputElement.classList.remove('shake');
}