# CollabSpace

A team collaboration app rebuilt with Java, Spring Boot, React and AI-assisted development for learning purposes.

## Stack

| Layer | Technology |
|---|---|
| Backend | Java 21, Spring Boot, Maven |
| Database | PostgreSQL |
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Auth | Spring Security, JWT, BCrypt |
| Dev | Docker Compose |

## Architecture

Modular monolith organized by feature.

The backend exposes a REST API built with Spring Boot, while the frontend is a React single-page application communicating through Axios.

## Current status

The project currently includes:

### Backend

- Spring Boot REST API
- PostgreSQL integration
- Flyway database migrations
- JWT authentication
- Spring Security configuration
- Workspace management
- Workspace member management
- Project management
- Project member management
- Task management
- Task status management
- Task assignment
- Membership-based authorization checks

### Frontend

- React + TypeScript application with Vite
- Tailwind CSS styling
- React Router
- Axios API client
- Protected routes
- Workspace dashboard
- Project pages
- Project member management
- Task creation and management
- Task detail pages
- Task assignment interface
- Kanban-style task visualization

## Collaboration features

### Workspaces

- Create and manage workspaces
- Manage workspace members
- Workspace ownership model

Roles:
- OWNER
- MEMBER

### Projects

- Create projects inside workspaces
- View project details
- Update project information
- Manage project members
- Delete projects

Statuses:
- ACTIVE
- COMPLETED
- ARCHIVED

### Tasks

- Create tasks inside projects
- Update task information
- Delete tasks
- Change task status
- Assign tasks to project members

Statuses:
- TODO
- IN_PROGRESS
- DONE

## Local development

### Start PostgreSQL

```bash
docker compose up -d
```

### Backend

```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## User flow

```text
Register
   ↓
Login
   ↓
Workspace dashboard
   ↓
Workspace
   ↓
Project
   ↓
Tasks
   ↓
Task details
```

## Project goals

CollabSpace is a learning project focused on:

- Building a full-stack application with Java and React
- Learning Spring Boot and Spring Security
- Applying clean architectural decisions
- Using AI coding tools as development assistants
- Iterating through small reviewable Git branches and pull requests
