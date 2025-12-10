# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EdgeUp College is a full-stack education management platform with separate portals for students, teachers, management, and superadmin users. The project uses a monorepo structure with a NestJS backend and Next.js frontend. This project is being built for the production so the claude code needs to be very careful and act as a professional dev.

## Tech Stack

**Backend:**
- NestJS (TypeScript) with TypeORM
- MySQL (dual database setup: `edgeup_college` and `edgeup_super_admin`)
- Socket.IO for real-time features
- JWT authentication with refresh tokens
- Passport.js for auth strategies

**Frontend:**
- Next.js 16 (App Router with TypeScript)
- React 19 with React Three Fiber for 3D visualizations
- Tailwind CSS with Radix UI components
- Socket.IO client for WebSockets
- React Hook Form with Zod validation
- Axios for API calls

## Development Commands

**Backend (from `/backend`):**
```bash
npm run dev          # Start backend in watch mode (port 3001)
npm run build        # Build for production
npm run start:prod   # Start production server
npm run lint         # Lint and fix TypeScript files
npm test             # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:cov     # Run tests with coverage
```

**Frontend (from `/frontend`):**
```bash
npm run dev          # Start Next.js dev server (port 3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Database Architecture

### Dual Database Setup

The application uses two separate MySQL databases:
- **edgeup_college**: Main application data (students, teachers, courses, etc.)
- **edgeup_super_admin**: Superadmin-specific data and configuration

Database connections are configured in `backend/src/database/`:
- `database.module.ts`: Primary database entities and connection
- `superadmin-database.module.ts`: Superadmin database entities and connection

### Running Migrations

SQL migration files are located in `backend/migrations/`. Apply them manually to the MySQL database in order:
```bash
mysql -u root -p edgeup_college < backend/migrations/001_create_leave_requests_table.sql
mysql -u root -p edgeup_college < backend/migrations/002_enhance_attendance_sessions.sql
# ... continue with other migrations
```

### Entity Organization

TypeORM entities are organized by domain in `backend/src/database/entities/`:
- `student/`: Student-related entities (users, profiles, enrollments, grades, attendance, etc.)
- `teacher/`: Teacher entities (users, courses, assignments, class sessions)
- `management/`: Admin entities (users, campus, department, program, financial)
- `study-groups/`: Study group collaboration entities
- `superadmin/`: Superadmin entities (in separate database)

## Backend Architecture

### Module Structure

Core modules (`backend/src/`):
- `auth/`: Multi-portal authentication (student, teacher, management, superadmin)
- `config/`: Environment configuration and database config
- `database/`: TypeORM entities and database modules
- `common/`: Shared guards, decorators, filters, interceptors, enums
- `shared/`: Shared services (currently password service)
- `modules/`: Feature modules organized by domain

Feature modules (`backend/src/modules/`):
- `student/`: Student dashboard, calendar, profile management
- `teacher/`: Teacher dashboard, assignments, resources, idea sandbox
- `management/`: Administrative functions, financial management
- `superadmin/`: Institute management, curriculum, courses, roles
- `attendance/`: Attendance tracking and sessions
- `leave/`: Leave request management
- `library/`: Digital library and resources
- `live-classes/`: Live class scheduling and management
- `study-groups/`: Collaborative study groups with WebSocket support
- `career/`: Career services, resume parsing, job matching

### Authentication System

The auth system supports four separate portals with isolated authentication:
- Each portal has its own JWT tokens (access + refresh)
- Token keys are prefixed by portal type (e.g., `student_accessToken`, `teacher_accessToken`)
- `AuthService` validates users across different entity repositories based on portal type
- Guards: `JwtAuthGuard`, `JwtRefreshGuard`, `RolesGuard`, `WsJwtGuard` (WebSocket)
- Decorators: `@Public()`, `@Roles()`, `@CurrentUser()`

### Global Configuration

In `backend/src/main.ts`:
- Global API prefix: `/api`
- CORS configured for multiple local origins (ports 3000-3002)
- Global validation pipe with class-validator
- Global exception filter and response transformer
- WebSocket adapter with custom CORS configuration
- Default port: 3001

## Frontend Architecture

### Route Structure

Next.js App Router with route groups:
- `app/(auth)/`: Login/register pages for each portal
- `app/(portal)/`: Protected portal routes
  - `student/`: Student dashboard, career tools, study center, wellness, exams
  - `teacher/`: Teacher dashboard, classroom, curriculum, growth (idea sandbox), smart assessment
  - `management/`: Financial management, risk mitigation, predictive intelligence
  - `superadmin/`: Institute management, course/curriculum admin, roles, logs
- `app/api/`: API route handlers (if any)

### Portal-Based Authentication

Middleware (`frontend/src/proxy.ts`) handles:
- Portal-specific token validation from cookies
- Redirecting authenticated users away from login pages
- Protecting portal routes (client-side auth check due to localStorage usage)
- Legacy route redirects (`/login` → `/student/login`)

### Service Layer

API services in `frontend/src/services/`:
- `api.client.ts`: Base Axios client with interceptors
- `auth.service.ts`: Authentication API calls with portal-specific token management
- Other domain-specific services

Token management:
- Tokens stored in both localStorage (primary) and cookies (for middleware)
- Portal-specific prefixes (e.g., `student_accessToken`)
- Helper functions for setting/deleting cookies

### Shared Code

- `components/`: 120+ reusable UI components organized by domain
- `lib/`: Utility libraries (API client, job matching, mock interview, validations, socket config)
- `hooks/`: Custom React hooks
- `contexts/`: React context providers
- `types/`: TypeScript type definitions
- `constants/`: Application constants
- `config/`: Configuration files

### WebSocket Integration

Socket.IO client configured in `frontend/src/lib/socket.ts`:
- Connects to backend WebSocket server
- Used for real-time features (study groups, live classes, etc.)
- JWT authentication via WebSocket guard

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and configure:

**Required:**
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` (primary DB)
- `SUPERADMIN_DB_*` variables (superadmin DB)
- `JWT_SECRET`, `JWT_REFRESH_SECRET` (change in production)

**Optional:**
- `MAGICAL_API_KEY`: For resume ATS scoring (falls back to mock scoring)
- `CORS_ORIGIN`: Additional CORS origins

## Key Features to Understand

### Multi-Portal Architecture
The entire application is designed around four isolated portals. When working on features:
- Always consider which portal(s) the feature affects
- Use portal-specific routes and guards
- Ensure tokens are properly namespaced by portal

### Study Groups with WebSockets
Real-time collaborative study groups use Socket.IO for messaging and teacher moderation.

### Career Module
Includes AI-powered features:
- Resume parsing (PDF extraction)
- ATS scoring via MagicalAPI
- Job matching algorithms
- Mock interview system (OpenAI integration potential)

### Idea Sandbox
Teacher collaboration platform for sharing and discussing educational ideas with comments and tags.

### Digital Library
Resource management system with file uploads stored in `backend/uploads/`.

## File Upload Handling

Uploads are stored in `backend/uploads/` with subdirectories by feature. The backend uses Multer for file handling.

## Common Patterns

### Creating a New Feature Module (Backend)

1. Create module directory in `backend/src/modules/[feature]/`
2. Define entities in `backend/src/database/entities/[domain]/`
3. Register entities in `database.module.ts`
4. Create DTOs, controller, service, and module files
5. Import module in `app.module.ts`
6. Add SQL migration if needed

### Creating a New Portal Route (Frontend)

1. Add route in `frontend/src/app/(portal)/[portal]/[feature]/`
2. Create page component (`page.tsx`)
3. Add any feature-specific components in `components/` subdirectory
4. Create API service functions in `frontend/src/services/`
5. Define TypeScript types in `frontend/src/types/`

### WebSocket Event Handling

Backend: Use `@WebSocketGateway()` decorator with Socket.IO
Frontend: Connect via socket instance from `lib/socket.ts`

## Testing

Backend tests use Jest with TypeORM repository mocking. Test files follow `*.spec.ts` naming convention in the `src/` directory.

## Important Notes

- The backend runs on port 3001, frontend on port 3000 by default
- API routes are prefixed with `/api` (e.g., `http://localhost:3001/api/auth/login`)
- Always validate inputs using class-validator DTOs on the backend
- Use React Hook Form + Zod for frontend validation
- TypeORM entities use decorators; avoid manual SQL queries when possible
- WebSocket connections require JWT authentication via custom guard
