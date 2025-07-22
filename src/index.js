// Import CSS files
import './styles/base.css';
import { renderAddTodoForm } from './ui/dom';
import { initController, getAllProjects } from './app/controller';

import { setupSidebarToggle, renderSidebarProjects, setupNavEvents, setActiveNavButton } from './ui/sidebar';
import { updateMainContent } from './ui/main';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    initController();
    setupSidebarToggle();    
    renderSidebarProjects(getAllProjects());
    setupNavEvents();
    renderAddTodoForm();
    loadInboxTodos();
});

function loadInboxTodos() {
    updateMainContent();
    const inboxButton = document.querySelector('.sidebar-static-btn[data-id="inbox"]');
    setActiveNavButton(inboxButton);
}



