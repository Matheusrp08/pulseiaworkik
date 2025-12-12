# Pulse IA Platform

Pulse IA is a full-stack AI-powered development platform designed to accelerate software creation through integrated AI models, chat interfaces, code generation, version timeline management, bugfix automation, preview sandboxing, deployment pipelines, and plugin management.

---

## Features

- **Chat Interface**: AI-powered chat sessions with message history.
- **Full-Stack Code Generation**: Generate frontend/backend code using AI.
- **Timeline & Version Control**: Track versions, diffs, and rollback.
- **Automatic Bug Detection & Fixing**: Scan and fix bugs automatically.
- **Instant Preview Sandbox**: Isolated environment for live previews.
- **Automated Deployment Pipelines**: Deploy to Fly.io, Vercel, Render, Railway.
- **Plugin System**: Extend functionality with custom plugins.
- **CLI Tools**: Scaffold projects, generate pages/APIs, deploy, diagnostics.

---

## Prerequisites

- **Node.js**: Version 18 or higher
- **Docker & Docker Compose**: For containerized setup
- **PostgreSQL**: Version 15+
- **Redis**: Version 7+
- **MinIO**: S3-compatible storage (optional, included in docker-compose)
- **Ollama LLM**: For local AI model (optional)
- **OpenAI API Key**: For cloud AI services

---

## Installation & Setup

### Backend Setup

1. Clone the repository.

2. Copy `.env.example` to `.env` and fill in environment variables:

        cp .env.example .env

3. Install backend dependencies and generate Prisma client:

        npm install
        npx prisma generate

4. Run Prisma migrations:

        npx prisma migrate dev

5. Start backend server (development mode):

        npm run dev:backend

### Frontend Setup

1. Navigate to frontend directory:

        cd src/frontend

2. Copy `.env.example` to `.env.local` and fill environment variables:

        cp .env.example .env.local

3. Install frontend dependencies:

        npm install

4. Start frontend development server:

        npm run dev

---

## Running with Docker Compose

1. Ensure `.env` is configured in the root directory.

2. Start all services:

        npm run docker:up

3. Access frontend at http://localhost:3001 and backend API at http://localhost:3000

4. To stop services:

        npm run docker:down

---

## Building for Production

### Backend

1. Build backend Docker image:

        docker build -f Dockerfile.backend -t pulseia-backend .

2. Run backend container:

        docker run -p 3000:3000 --env-file .env pulseia-backend

### Frontend

1. Build frontend Docker image:

        docker build -f Dockerfile.frontend -t pulseia-frontend .

2. Run frontend container:

        docker run -p 3001:3001 --env-file src/frontend/.env pulseia-frontend

---

## Deployment

Pulse IA supports deployment to multiple cloud providers:

- **Fly.io**
- **Vercel**
- **Render**
- **Railway**

Configure environment variables accordingly (`DEPLOY_TARGET`) and use the CLI to trigger deployments.

Example deployment command:

    npm run cli deploy --target vercel

---

## Project Structure

