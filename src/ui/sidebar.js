import { deleteProject } from '../app/controller.js';

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
        console.log('New project button clicked');        
    });
}

function handleProjectEdit(projectItem) {
    const projectContent = projectItem.querySelector('.project-item-content');
    const projectId = projectContent.dataset.id;    
    const projectInput = document.querySelector('.project-input');
    console.log('Handling project edit for:', projectId);
}

function handleProjectDelete(projectItem) {    
    const projectContent = projectItem.querySelector('.project-item-content');
    const projectId = projectContent.dataset.id;
    console.log('Handling project delete for:', projectId);

    if (confirm(`Are you sure you want to delete the project "${projectId}"?`)) {    
        const result = deleteProject(projectId);
        if (result.success) {            
            projectItem.remove();
        } else {
            alert(result.message || 'Failed to delete project');            
        }    
    }
    
    // Here you would call the deleteProject function from your controller
    // deleteProject(projectId);
}