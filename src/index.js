// Import CSS files
import './styles/main.css';
import { initDOM } from './ui/dom';
import { renderInbox } from './ui/todo-list-ui';
import { renderProjectList } from './ui/project-ui';
import { loadFromStorage, loadProjects } from './app/storage';
import { getAllProjects } from './app/project';
import { initController } from './app/controller';

import { showNewProjectForm } from './ui/form-ui';
import { setupSidebarToggle } from './ui/sidebar';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    setupSidebarToggle();
    // Initialize the DOM
    //  initDOM();

    // Initialize the controller
    initController();

    // Load projects from storage
    // loadProjects();

    // Render the project list
    renderProjectList();

    // renderInbox();

    setupNavEvents();
});

function setupNavEvents() {
    console.log('Setting up navigation events');
    document.getElementById('inbox-btn').addEventListener('click', renderInbox);

    document.getElementById('new-project-btn').addEventListener('click', () => {
        console.log('New project button clicked');
        showNewProjectForm();
    });
}