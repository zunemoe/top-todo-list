# Todo List App Ideas

- I will use Factory functions and ES6 Module pattern
    - Factory functions to build todos and projects
    - ES6 Module pattern to organize and reuse factory functions

---

## Todo item

Each todo item will include
- id
- title
- description
- dueDate
- assignee
- priority (low, medium, high)
- subTasks [extra]
- projectId
- createdDate
- updatedDate

--- 

## Project

Each project will include
- id
- title
- todos

---

## Functionalities

### Project
- Ability to create a new project with just title
- Ability to edit project name
- Ability to delete a project and it will delete all todo items associated with the project

### Todo List and Item
- Ability to create a new todo item, display in modal
- If the projct is not tagged to the todo item, it will show in Inbox.
- Inbox will show all the INCOMPLETE todo items 
    - Categorize the list by (overdue, today, upcomings) - [extra]
- The list will show todo item-
    - title
    - 1 line description
    - dueDate
    - delete button    
    - color code the item based on priority
    - click to show a modal with all the details and ability to edit
    - checkbox to complete
- Grid view and ability to toggle between gird and list view [extra]
- Sort by dueDate, priority, title [extra]

### Miscellaneous
- All projects and todo items will be store in localstorage
- Populate dummy data in object array and load them at startup
- **Explore date-fns usage**
- Global search function [extra]
---

## UI

### Mobile
UI component structure (flex: column)
- Header
- Nav (inbox, today, this week, projects)
- Todo list
- Footer

### Tablet/Desktop
UI component structure (grid 3x2)
- Header (span: 2)
- Nav | Todolist
- Footer (span: 2)

---

## Architecture
- template.html -> static shell with placeholders
- index.js -> loads saved data, render nav bar, display todo lists, connect buttons to handlers
- styles/ -> css files will go there (variables, responsive, layout, pages)
- ui/ -> separate UIs into each files and only handle DOM + event handling
- app/ -> logic + storage
    - project.js -> factory for project object
    - todo.js -> factory for todo objects
    - controllers.js -> central state manager (CRUD)
    - storage.js -> localStorage read/write


