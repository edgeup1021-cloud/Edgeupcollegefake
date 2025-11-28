# EdgeUp College - Project Documentation

## Project Overview

EdgeUp College is an educational management portal with three user roles: **Student**, **Teacher**, and **Management**. The application follows a monorepo-style structure with separate frontend and backend directories.

## Tech Stack

### Frontend
- **Framework**: Next.js 16.0.5 (App Router)
- **React**: 19.2.0
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI (accordion, avatar, dialog, slot)
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge, class-variance-authority

### Backend
- **Framework**: NestJS 10
- **Language**: TypeScript 5
- **ORM**: Prisma (scaffolded but not configured)
- **Runtime**: Node.js

## Project Structure

```
Edgeupcollegefake/
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── (auth)/           # Auth routes (login)
│       │   ├── (portal)/         # Main portal routes
│       │   │   ├── student/      # Student module pages
│       │   │   ├── teacher/      # Teacher module pages
│       │   │   └── management/   # Management module pages
│       │   ├── layout.tsx        # Root layout with providers
│       │   └── globals.css
│       ├── components/
│       │   ├── providers/        # Context providers
│       │   │   ├── ThemeProvider.tsx
│       │   │   └── SidebarProvider.tsx
│       │   └── ui/
│       │       ├── student/      # Student-specific components
│       │       └── [shared components]
│       └── lib/
│           └── utils.ts
├── backend/
│   └── src/
│       ├── student/              # Student module
│       ├── teacher/              # Teacher module (scaffolded)
│       ├── auth/                 # Auth module (scaffolded)
│       ├── management/           # Management modules (scaffolded)
│       ├── prisma/               # Prisma service (scaffolded)
│       ├── common/               # Guards, filters, pipes (scaffolded)
│       ├── config/               # Configuration (scaffolded)
│       └── utils/                # Utilities (scaffolded)
└── screenshots/                  # UI screenshots
```

## Student Module Analysis

### Backend (`backend/src/student/`)

**Current Implementation Status**: Minimal - Only basic structure with mock data.

**Files**:
- `student.module.ts` - NestJS module definition
- `student.controller.ts` - Single GET `/student/overview` endpoint
- `student.service.ts` - Returns hardcoded mock data
- `dto/create-student.dto.ts` - Empty (0 bytes)
- `dto/update-student.dto.ts` - Empty (0 bytes)

**API Endpoints**:
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/student/overview` | Returns mock student overview data |

**Mock Response**:
```json
{
  "totalCredits": 24,
  "completedCourses": 6,
  "pendingAssignments": 3,
  "gpa": 3.7,
  "message": "Student overview data fetched successfully"
}
```

**Issues**:
1. No database integration (Prisma schema is empty)
2. DTOs are empty - no validation
3. No authentication/authorization on endpoints
4. No CRUD operations implemented
5. `main.ts` and `app.module.ts` are empty - backend won't start

### Frontend (`frontend/src/app/(portal)/student/`)

**Current Implementation Status**: UI scaffolded with navigation, pages are placeholder stubs.

**Pages**:
| Route | Component | Status |
|-------|-----------|--------|
| `/student/overview` | StudentOverviewPage | Basic placeholder with welcome text |
| `/student/study-center` | StudyCenterPage | Stub ("Study Center") |
| `/student/smart-assistant` | SmartAssistantPage | Stub ("Smart Assistant") |
| `/student/career-placement-guide` | CareerPlacementGuidePage | Stub ("Career & Placement Guide") |
| `/student/job-matcher` | JobMatcherPage | Stub ("Job Matcher") |
| `/student/mental-health-wellness` | MentalHealthWellnessPage | Stub ("Mental Health & Wellness") |

**Components** (`frontend/src/components/ui/student/`):
| Component | Purpose | Status |
|-----------|---------|--------|
| `TopNavbar.tsx` | Main navigation with dropdowns | Fully implemented |
| `StudentSidebar.tsx` | Collapsible sidebar (not currently used in layout) | Fully implemented |
| `NavDropdown.tsx` | Dropdown menu component | Fully implemented |
| `UserMenu.tsx` | User avatar dropdown with profile/logout | Fully implemented |
| `MobileHeader.tsx` | Mobile header with menu toggle | Fully implemented |

**Navigation Structure**:
- Overview (direct link)
- Study (dropdown)
  - Study Center
  - Smart Assistant
- Career (dropdown)
  - Career & Placement Guide
  - Job Matcher
- Wellness (direct link to Mental Health & Wellness)

## Providers

### ThemeProvider
- Supports `light`, `dark`, `system` themes
- Persists to localStorage
- Exposes `useTheme()` hook

### SidebarProvider
- Manages sidebar collapsed state
- Handles mobile responsive behavior
- Persists collapsed state to localStorage
- Exposes `useSidebar()` hook

## Commands

### Frontend
```bash
cd frontend
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Backend
```bash
cd backend
npm run dev      # Start with --watch (requires main.ts implementation)
npm run start    # Start server
npm run build    # Build for production
```

## Critical Issues to Address

### Backend (High Priority)
1. **`main.ts` is empty** - NestJS bootstrap code needed
2. **`app.module.ts` is empty** - Must import all feature modules
3. **Prisma schema is empty** - No database models defined
4. **No authentication** - JWT strategy files are empty
5. **Empty DTOs** - No request validation

### Frontend
1. **No API integration** - Pages don't fetch from backend
2. **Placeholder pages** - All student pages except overview are stubs
3. **Hardcoded user data** - User profile is static

## Architecture Notes

- Frontend uses Next.js App Router with route groups `(auth)` and `(portal)`
- Student layout uses TopNavbar (previously had sidebar but was simplified)
- Dark/light theme support implemented via Tailwind's `dark:` variant
- Mobile responsive with hamburger menu navigation

## Next Steps for Development

1. Implement `main.ts` with NestJS bootstrap
2. Configure `app.module.ts` with all modules
3. Define Prisma schema with Student, User, Course models
4. Implement JWT authentication flow
5. Add CRUD operations to student service
6. Connect frontend pages to backend API
7. Build out individual feature pages
