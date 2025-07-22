import { loadProjects, saveProjects, loadTodo, loadTodos, addTodo, deleteTodo, updateTodo } from './storage';
import { createProject } from './project';
import { createTodo } from './todo';
import { createModal } from './components/modal';
import { createTodoForm } from '../ui/todo-form';
import { updateMainContent } from '../ui/main';

let projects = [];

export function initController() {
    console.log('Controller initialized');
    projects = loadProjects();
    if (!projects || projects.length === 0) {
        projects = generateDummyProjects();
    }

    // ✅ Set initial active project if none exists
    const activeProjectId = localStorage.getItem('activeProjectId');
    if (!activeProjectId) {
        localStorage.setItem('activeProjectId', 'inbox');
        console.log('Set initial active project to Inbox');
    }
}

export function getAllProjects() {
    console.log('Fetching all projects');
    return projects;
}

export function addProject({ title }) {
    try {
        if (!title || title.trim() === '') {
            return { success: false, message: 'Project title cannot be empty' };
        }

        const duplicateExists = projects.some(project => project.title.toLowerCase() === title.trim().toLowerCase());
        if (duplicateExists) {
            return { success: false, message: 'Project with this title already exists' };
        }

        const newProject = createProject({ title });
        projects.push(newProject);
        saveProjects(projects);
        return { success: true, message: 'Project added successfully', data: newProject };
    } catch (error) {
        console.error('Error adding project:', error);
    }
}

function generateDummyProjects() {
  console.log("Generating dummy projects");
  const projectTitles = ["Personal", "Work", "Groceries", "Reading List"];
  const dummyProjects = projectTitles.map((title) => createProject({ title }));

  // Sample todos data
  const sampleTodos = {
    Personal: [
      {
        title: "Call dentist for appointment",
        description: "Schedule cleaning and checkup for next month",
        priority: "high",
        dueDate: "2025-07-25",
      },
      { title: "Organize photo albums", priority: "low" },
      {
        title: "Plan weekend trip",
        description:
          "Research destinations, book hotel, and create itinerary for the family vacation",
        priority: "medium",
        dueDate: "2025-07-30",
      },
      { title: "Update resume", priority: "medium" },
    ],
    Work: [
      {
        title: "Finish quarterly report",
        description:
          "Compile Q3 metrics, analyze performance trends, and prepare executive summary",
        priority: "high",
        dueDate: "2025-07-28",
      },
      {
        title: "Schedule team meeting",
        description:
          "Coordinate with all team members for sprint planning session",
        priority: "medium",
      },
      {
        title: "Review code submissions",
        priority: "high",
        dueDate: "2025-07-24",
      },
      {
        title: "Prepare presentation slides",
        priority: "medium",
        dueDate: "2025-07-26",
      },
    ],
    Groceries: [
      { title: "Buy milk and eggs", priority: "high" },
      {
        title: "Get fresh vegetables",
        description:
          "Carrots, broccoli, spinach, and bell peppers for the week",
        priority: "medium",
      },
      {
        title: "Pick up prescription",
        description: "Monthly medication refill at CVS pharmacy",
        priority: "high",
      },
      {
        title: "Buy birthday gift for mom",
        priority: "medium",
        dueDate: "2025-07-29",
      },
    ],
    "Reading List": [
      {
        title: 'Finish "The Clean Code" book',
        description: "Complete chapters 8-12 and take notes on key principles",
        priority: "medium",
      },
      { title: "Read latest tech articles", priority: "low" },
      { title: "Study JavaScript patterns", priority: "high" },
      {
        title: "Review design principles",
        description:
          "Focus on SOLID principles and their practical applications",
        priority: "medium",
      },
    ],
  };

  dummyProjects.forEach((project) => {
    const _todos = sampleTodos[project.title] || [];
    
    _todos.forEach((todo) => {
      addTodo(createTodo({
        ...todo,
        projectId: project.id, // Assign project ID to each Todo
      }));
    });
  });

  saveProjects(dummyProjects);
  return dummyProjects;
}

export function deleteProject(projectId) {
    try {
        const initialLength = projects.length;
        projects = projects.filter(project => project.id !== projectId);

        if (projects.length === initialLength) return { success: false, message: 'Project not found' };
        saveProjects(projects);
        // console.log(`Project with ID ${projectId} deleted successfully`);
        return { success: true, message: 'Project deleted successfully' };
    } catch (error) {
        console.error('Error deleting project:', error);
        return { success: false, message: 'Failed to delete project' };
    }
}

export function updateProject(projectId, updatedData) {
    const projectIndex = projects.findIndex(project => project.id === projectId);
    if (projectIndex === -1) return { success: false, message: 'Project not found' };

    projects[projectIndex] = { ...projects[projectIndex], ...updatedData };
    saveProjects(projects);
    // console.log(`Project with ID ${projectId} updated successfully`);
    return { success: true, message: 'Project updated successfully' };
}

export function findProjectById(projectId) {
    console.log('Finding project by ID:', projectId);
    return projects.find(project => project.id === projectId);
}

// export function loadAllTodos() {
//     console.log('Loading all todos for all projects');
//     return projects.flatMap(project => loadTodos(project.id));
// }

export function _loadTodos(projectId) {
    console.log(`Loading todos for project ID: ${projectId}`);
    return loadTodos(projectId);
}

export function _saveTodo(formData, todo, modal, todoForm) {
    const updatedTodo = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      updatedAt: new Date().toISOString()
    };
    updateTodo(todo.id, updatedTodo);

    const activeProjectId = localStorage.getItem('activeProjectId');
    updateMainContent(activeProjectId || 'inbox');
}

export function _createTodo(formData, modal, todoForm) {    
    const todoData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      completed: false,
    }
    console.log('Creating todo with data:', todoData);
    const newTodo = createTodo(todoData);
    addTodo(newTodo);

    if (newTodo.projectId) updateMainContent(newTodo.projectId);
    else updateMainContent('inbox');
}

export function _deleteTodo(todoId) {
    console.log(`Deleting todo with ID: ${todoId}`);
    const todo = loadTodo(todoId);
    if (!todo) {
        console.warn(`Todo with ID ${todoId} not found`);
        return;
    }
    deleteTodo(todoId);
    updateMainContent(todo.projectId);
}

export function toggleTodoCompleteById(todoId) {
    const todo = loadTodo(todoId);
    if (todo) {
        todo.completed = !todo.completed;
        updateTodo(todoId, { completed: todo.completed });
    }
    const activeProjectId = localStorage.getItem('activeProjectId');
    updateMainContent(activeProjectId || 'inbox');
}

export function openTodoForm(todo = null) {
  const modal = createModal();

  const todoForm = createTodoForm(
    (formData) => {
      handleFormSubmit(formData, todo, modal, todoForm);
      modal.close();
      todoForm.cleanup();
    },
    () => {
      console.log("Form cancelled");
      modal.close();
      todoForm.cleanup();
    }
  );

  const formElement = todoForm.render(todo);
  modal.open(formElement);
  todoForm.focus();
}

function handleFormSubmit(formData, todo = null, modal, todoForm) {
  if (todo) {
    // updateTodo(todo.id, formData);
    console.log('Updating existing todo:', todo.id);
    _saveTodo(formData, todo, modal, todoForm);
  } else {
    console.log('Creating new todo');
    _createTodo(formData, modal, todoForm);
  }
}

