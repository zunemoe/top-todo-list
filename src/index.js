// Import CSS files
import './styles/base.css';
import { renderAddTodoForm } from './ui/dom';
import { initController, getAllProjects } from './app/controller';

import { setupSidebarToggle, renderSidebarProjects, setupNavEvents, setActiveNavButton } from './ui/sidebar';
import { updateMainContent } from './ui/main';

window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    alert('Error: ' + e.message); // For mobile debugging
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    // Test each function individually to identify which one fails
    try {
        console.log('Starting initController...');
        initController();
        console.log('✅ initController completed');
    } catch (error) {
        console.error('❌ initController failed:', error);
        alert('initController failed: ' + error.message);
        return; // Stop execution if controller fails
    }

    try {
        console.log('Starting setupSidebarToggle...');
        setupSidebarToggle();
        console.log('✅ setupSidebarToggle completed');
    } catch (error) {
        console.error('❌ setupSidebarToggle failed:', error);
        alert('setupSidebarToggle failed: ' + error.message);
    }

    try {
        console.log('Starting renderSidebarProjects...');
        const projects = getAllProjects();
        console.log('Got projects:', projects);
        renderSidebarProjects(projects);
        console.log('✅ renderSidebarProjects completed');
    } catch (error) {
        console.error('❌ renderSidebarProjects failed:', error);
        alert('renderSidebarProjects failed: ' + error.message);
    }

    try {
        console.log('Starting setupNavEvents...');
        setupNavEvents();
        console.log('✅ setupNavEvents completed');
    } catch (error) {
        console.error('❌ setupNavEvents failed:', error);
        alert('setupNavEvents failed: ' + error.message);
    }

    try {
        console.log('Starting renderAddTodoForm...');
        renderAddTodoForm();
        console.log('✅ renderAddTodoForm completed');
    } catch (error) {
        console.error('❌ renderAddTodoForm failed:', error);
        alert('renderAddTodoForm failed: ' + error.message);
    }

    try {
        console.log('Starting loadInboxTodos...');
        loadInboxTodos();
        console.log('✅ loadInboxTodos completed');
    } catch (error) {
        console.error('❌ loadInboxTodos failed:', error);
        alert('loadInboxTodos failed: ' + error.message);
    }

    try {
        console.log('Starting loadFooter...');
        loadFooter();
        console.log('✅ loadFooter completed');
    } catch (error) {
        console.error('❌ loadFooter failed:', error);
        alert('loadFooter failed: ' + error.message);
    }

    console.log('🎉 All initialization completed');
    // try {
    //     initController();
    //     setupSidebarToggle();    
    //     renderSidebarProjects(getAllProjects());
    //     setupNavEvents();
    //     renderAddTodoForm();
    //     loadInboxTodos();
    //     loadFooter();
    // } catch (error) {
    //     console.error('Error during initialization:', error);
    //     document.body.innerHTML = `
    //         <div class="error-message">
    //             <h1>Something went wrong!</h1>
    //             <p>Please try refreshing the page.</p>
    //         </div>
    //     `;
    // }    
});

function loadInboxTodos() {
    updateMainContent();
    const inboxButton = document.querySelector('.sidebar-static-btn[data-id="inbox"]');
    setActiveNavButton(inboxButton);
}

function loadFooter() {
    const footer = document.querySelector('footer');
    if (footer) {
        footer.innerHTML = `
            &copy; ${new Date().getFullYear()} Not Todo List. Made with ❤️ by zunemoe in Auckland.
        `;
    }
}



