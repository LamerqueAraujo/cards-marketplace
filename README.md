# Cards Marketplace

Trading cards marketplace SPA built with Vue 3, Quasar and TypeScript.

This project was developed as part of a technical challenge and simulates a real production-ready frontend application, focusing on architecture, UX, maintainability and best development practices.

---

## 🚀 Tech Stack

- Vue 3
- Quasar Framework (SPA)
- TypeScript
- Pinia (state management)
- Vue Router
- Axios
- Zod (form validation)
- ESLint + Prettier

---

## 🧱 Architecture

The application follows a modular architecture based on domain separation:


src/
modules/
auth/
marketplace/
cards/
trades/

shared/
components/
services/
types/
utils/

stores/
boot/
layouts/


### Principles applied

- Separation of responsibilities
- Scalable folder structure
- Centralized API layer
- Reusable UI components
- Typed domain models

---

## 🔐 Main Features

- User registration
- User authentication
- Add cards to user account
- Create trade requests
- Delete trade requests
- Public marketplace listing open trades

---

## 🌐 API

Base URL:


https://cards-marketplace-api.onrender.com/


Endpoints used:

- POST /register
- POST /login
- GET /me
- GET /cards
- GET /me/cards
- POST /me/cards
- GET /trades
- POST /trades
- DELETE /trades/:id

---

## 🧭 Project Management

This project follows a Kanban workflow simulating a real development team.

### Board structure

- Backlog
- To Do
- In Progress
- Review
- Done

### Git flow

- main → production-ready code
- develop → integration branch
- feature/* → feature development
- fix/* → bug fixes
- refactor/* → code improvements

---

## 🛠️ Development Setup

### Requirements

- Node.js LTS
- npm
- Git

### Installation

```bash
npm install -g @quasar/cli
Running project
git clone <repo-url>
cd cards-marketplace

git checkout develop

quasar create .
npm install
npm run dev
📦 Branch Strategy
main
develop
feature/*
fix/*
refactor/*
docs/*

Example:

feature/auth-login
feature/trades-create
fix/api-error-handling
🧾 Commit Pattern

Conventional commits:

feat(scope): description
fix(scope): description
refactor(scope): description
docs: description
chore: description

Example:

feat(auth): implement login flow
feat(trades): integrate trade creation
fix(api): handle 401 globally
docs: add architecture documentation
🎨 UX Approach

Marketplace-first UI

Card-based layout

Loading states

Empty states

Error feedback

Responsive design

🚀 Deployment

The application will be deployed as a SPA after implementation is complete.
