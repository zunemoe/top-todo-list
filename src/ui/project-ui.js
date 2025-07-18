import { getAllProjects } from '../app/controller';

export function renderProjectList(projects = getAllProjects()) {
    const listContainer = document.querySelector('#project-list');
    if (!listContainer) return;

    listContainer.innerHTML = ''; // Clear existing content
    console.log('Rendering project list with projects:', projects);
    projects.forEach((project) => {
        const li = document.createElement('li');
        li.classList.add('project-item');

        const btn = document.createElement('button');
        btn.classList.add('project-btn');
        btn.textContent = project.title;
        btn.setAttribute('data-id', project.id);

        btn.addEventListener('click', () => {
            console.log(`Project clicked: ${project.title}`);
        });

        li.appendChild(btn);
        listContainer.appendChild(li);
    });
}