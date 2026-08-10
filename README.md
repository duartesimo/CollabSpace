# CollabSpace

A team collaboration app rebuilt with Java, Spring Boot, React and AI-assisted development for learning purposes.

## Stack

| Layer    | Technology |
|----------|------------|
| Backend  | Java 21, Spring Boot, Maven |
| Database | PostgreSQL |
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Auth     | Spring Security, JWT, BCrypt |
| Dev      | Docker Compose |

## Architecture

Modular monolith organized by feature.

The backend exposes a REST API built with Spring Boot, while the frontend is a React single-page application that communicates with it through Axios.

## Repository layout

```text
CollabSpace/
├── backend/            # Spring Boot REST API
├── frontend/           # React + TypeScript SPA
├── docs/               # Project documentation
├── docker-compose.yml  # Local PostgreSQL service
└── README.md
```

## Current status

The project currently includes:

### Backend
- Spring Boot application foundation
- PostgreSQL integration
- Flyway database migrations
- User registration and profile endpoints
- BCrypt password hashing
- JWT-based authentication
- Spring Security configuration
- CORS support for local frontend development

### Frontend
- React + TypeScript application with Vite
- Tailwind CSS styling
- React Router
- Axios API client
- Login and registration pages
- JWT token storage and authentication context
- Protected routes
- Authenticated user profile
- Logout flow
- Authentication-aware navigation

## Authentication flow

```text
Register
   ↓
POST /api/users
   ↓
PostgreSQL

Login
   ↓
POST /api/auth/login
   ↓
JWT stored in the frontend

Protected request
   ↓
Authorization: Bearer <JWT>
   ↓
Spring Security
   ↓
GET /api/users/me
```

## Local development

### 1. Start PostgreSQL

From the repository root:

```bash
docker compose up -d
```

### 2. Start the backend

```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

The backend runs on:

```text
http://localhost:8080
```

### 3. Configure the frontend

From the `frontend` directory:

```bash
cp .env.example .env
```

The local environment should contain:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 4. Start the frontend

```bash
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Available functionality

Current user flow:

- Register a new account
- Login with email and password
- Receive and store a JWT
- Access protected routes
- View the authenticated user's profile
- Logout

## Documentation

- [Project context](docs/PROJECT_CONTEXT.md) — goals, scope and architectural decisions
- [Roadmap](docs/ROADMAP.md) — planned phases and milestones

## Project goals

CollabSpace is primarily a learning project focused on:

- building a full-stack application with Java and React
- learning Spring Boot and Spring Security
- applying clean architectural decisions
- using AI coding tools as development assistants rather than replacing understanding
- iterating through small, reviewable Git branches and pull requests
