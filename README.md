# 📝 Vanilla To-Do List App

A clean and modular to-do list application built with **vanilla JavaScript**, **HTML**, and **CSS**. No frameworks. Uses `localStorage` for data persistence and `Webpack` for bundling.

---

## 🚀 Features

- ✅ **Todo Items**
  - Title, description, due date, priority, assignee
  - Checklists within todo items
  - Assign todo to a project
  - Create, update, delete todos

- 📂 **Projects**
  - Title and description
  - Manage associated todos
  - Create, update, delete projects

- 📥 **Inbox View**
  - View all todos across all projects

- 💾 **LocalStorage**
  - All data stored in the browser

- 🔧 **Separation of Concerns**
  - Application logic is decoupled from DOM manipulation

---

## 🏗️ Project Structure

src/
├── app/ # Core logic (Todo, Project, Controller, Storage)
├── ui/ # DOM rendering and UI updates
├── styles/ # CSS (base, layout, responsive, component styles)
├── assets/ # Static files
├── index.js # Webpack entry point

---

## 🛠️ Built With

- Vanilla JavaScript
- HTML5
- CSS3 (modular architecture)
- Webpack (module bundler)

---

## Design Philosophy

- Separation of concerns between logic and UI
- Small, single-responsibility modules
- CSS broken into layers and components
- Easily scalable without frameworks