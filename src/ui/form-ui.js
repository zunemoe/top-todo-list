import { addProject, getAllProjects } from "../app/controller"; 
import { renderProjectList } from "./project-ui";

export function showNewProjectForm() {
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');

    const modal = document.createElement('div');
    modal.classList.add('modal');
    
    const form = document.createElement('form');
    form.classList.add('project-form');

    form.innerHTML = `
        <div class="modal-header">
            <h2>Create New Project</h2>
            <button type="button" class="close-btn">&times;</button>
        </div>       
        <div class="modal-body">
            <label>
                Title:
                <input type="text" name="title" required />
            </label>
            <label>
                Description:
                <textarea name="description"></textarea>
            </label>
        </div>
        <div class="modal-footer">
            <button type="button" class="cancel-btn">Cancel</button>    
            <button type="submit" class="submit-btn">Create</button>
        </div>
    `;

    function closeModal() {
        document.body.removeChild(modalOverlay);
        document.body.classList.remove('modal-open');
    }

    modal.appendChild(form);
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);
    document.body.classList.add('modal-open');

    const closeBtn = modal.querySelector('.close-btn');
    const cancelBtn = modal.querySelector('.cancel-btn');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = form.title.value.trim();
        const description = form.description.value.trim();

        if (!title) return;

        const newProject = addProject({ title, description });
        console.log('New project added:', newProject);

        const allProjects = getAllProjects();
        console.log('All projects:', allProjects);

        renderProjectList();
        closeModal();
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        });
    }

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    });

    setTimeout(() => form.title.focus(), 100); // Focus on the title input after a short delay
}