// Import CSS files
import './styles/main.css';
import { initDOM } from './ui/dom';
import { renderInbox } from './ui/todo-ui';
import { renderProjectList } from './ui/project-ui';
import { loadFromStorage } from './app/storage';
import { getAllProjects } from './app/project';

import { showNewProjectForm } from './ui/form-ui';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    // // Initialize the DOM
    // initDOM();

    // // Load projects from storage
    // loadFromStorage();

    // // Render the project list
    // renderProjectList(getAllProjects());

    // renderInbox();

    setupNavEvents();
});

function setupNavEvents() {
    console.log('Setting up navigation events');
    document.getElementById('inbox-btn').addEventListener('click', renderInbox);

    document.getElementById('new-project-btn').addEventListener('click', () => {
        console.log('New project button clicked');
    });
}

document.getElementById('new-project-btn').addEventListener('click', () => {
    console.log('New project button clicked');
    showNewProjectForm();
});

