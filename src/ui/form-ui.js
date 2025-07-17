import { addProject } from "../app/controller"; 
import { renderProjectList } from "./project-ui";

export function showNewProjectForm() {
    const main = document.getElementById('main');
    if (!main) return;
    main.innerHTML = '';


    const form = document.createElement('form');
    form.classList.add('project-form');

    form.innerHTML = `
        <h2>Create New Project</h2>
        <label>
            Title:
            <input type="text" name="title" required />
        </label>
        <label>
            Description:
            <textarea name="description"></textarea>
        </label>
        <button type="button" class="cancel-btn">Cancel</button>
        <button type="submit">Create Project</button>        
    `;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = form.title.value.trim();
        const description = form.description.value.trim();

        if (!title) return;

        addProject({ title, description });
        renderProjectList();
        main.innerHTML = ''; // Clear the form after submission
    });
    form.querySelector('.cancel-btn').addEventListener('click', () => {
        main.innerHTML = ''; // Clear the form when cancel is clicked
    });
    main.appendChild(form);
}