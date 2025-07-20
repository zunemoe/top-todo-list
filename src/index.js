// Import CSS files
import './styles/main.css';
import { initDOM } from './ui/dom';
import { renderInbox } from './ui/todo-list-ui';
import { renderProjectList } from './ui/project-ui';
import { loadFromStorage, loadProjects } from './app/storage';

import { initController, getAllProjects } from './app/controller';

import { showNewProjectForm } from './ui/form-ui';
import { setupSidebarToggle, renderSidebarProjects, setupNavEvents } from './ui/sidebar';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    initController();
    setupSidebarToggle();
    setupNavEvents();
    renderSidebarProjects(getAllProjects());
    // Initialize the DOM
    //  initDOM();

    // Initialize the controller
    

    // Load projects from storage
    // loadProjects();

    // Render the project list
    // renderProjectList();

    // renderInbox();
});

function generateDummyProjects() {
    console.log('Generating dummy projects');
    const dummyProjects = [
        { title: 'Personal' },
        { title: 'Work' },
        { title: 'Groceries' },
        { title: 'Reading List' }
    ];
    
    dummyProjects.forEach(project => addProject(project));
}

