# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **zhima-programming-web** - a Nuxt.js-based online programming learning platform (version 25.0.0-RELEASE) that integrates video teaching with a graphical homework system based on the open-source OJ system HOJ. The platform creates a closed-loop learning experience combining "study-practice-evaluation-feedback".

## Common Development Commands

```bash
npm run dev          # Start development server with HTTPS on localhost:3000
npm run build        # Build for production
npm run lint         # ESLint with auto-fix
npm run prettier     # Format code with Prettier
npm run zip          # Create deployment package
```

## Architecture Overview

### Core Technology Stack
- **Nuxt 3.17.2** (Vue 3.5.20) - Full-stack Vue framework with SSR disabled
- **Element Plus 2.9.9** - UI component library with icons
- **TypeScript** - Full TypeScript support
- **Vite 6.3.4** - Build tool with HTTPS development server
- **VueUse 10.9.0** - Composition utilities
- **Axios 1.11.0** - HTTP client with interceptors

### Directory Structure
```
pages/              # Nuxt page components (auto-routing)
  ├── account/      # Account management
  ├── assessment/   # Assessment functionality
  ├── course/       # Course management
  ├── lecturer/     # Lecturer features
  ├── problems/     # Problem/OJ interface
  ├── reports/      # Reports and analytics
  ├── student/      # Student portal
  └── works/        # AIGC works showcase

components/         # Reusable Vue components organized by feature
  ├── Account/
  ├── Common/
  ├── Course/
  ├── Lecturer/
  ├── Works/
  └── Zone/

layouts/            # Nuxt layouts (default, admin, student, account)
api/                # API service layer and mock system
composables/        # Vue composition functions
utils/              # Utility functions
data/               # Mock data files (JSON)
```

### Mock-First Development Architecture

This project uses a comprehensive mock system for frontend development:

**Key Mock Files:**
- `api/mock.js` - Main mock API service
- `utils/request.js` - Request/response interceptors
- `data/` - Mock data storage (JSON files)

**Environment Switching:**
- Development: Requests intercepted → Mock API service → Mock data
- Production: Normal HTTP requests → Backend API → Real data

The mock system enables full feature development without backend dependencies.

### Layout System
- **default.vue** - Standard layout with header/navigation
- **admin.vue** - Admin-specific layout
- **student.vue** - Student portal layout
- **account.vue** - Account management layout

### Key Features
- **Course Management** - Video content delivery, progress tracking
- **Programming Practice** - OJ integration, code evaluation
- **AIGC Works Showcase** - Multi-media work upload and display
- **AI Teaching Assistant** - Smart Q&A and personalized learning

## Development Environment Setup

### HTTPS Development
The development server uses HTTPS with custom certificates:
- `localhost.key` and `localhost.crt` files required
- Development runs on `localhost:3000` with HMR on `3001`

### Environment Configuration
- `.env.development` - Development environment variables
- `.env.production` - Production environment variables
- Mock data automatically enabled in development via `useMockData` config

### Build Configuration
- Terser minification with console/debugger removal
- Chunk size warning limit: 1500KB
- Source maps enabled in development only
- Production builds to `.output/` directory

## API Layer Architecture

**Request Flow:**
1. API calls made through composables (`useCourseApi`, `useUserApi`)
2. Axios interceptors handle request/response transformation
3. Development: Mock service intercepts and returns mock data
4. Production: Normal HTTP requests to backend

**Mock Data Structure:**
- `courses.json` - Course catalog and details
- `aigc-works.json` - Student work submissions
- `user-info.json` - User profiles and permissions

## Component Patterns

- **Composition API** throughout (`<script setup>`)
- **Element Plus** components for consistent UI
- **Feature-based organization** of components
- **Reusable composables** for common logic

## Testing & Quality

- **ESLint 9.26.0** with Vue plugin for code quality
- **Prettier 3.2.5** for code formatting
- **TypeScript** for type safety
- No dedicated test framework currently configured

## Specific Development Notes

### Special File Context
The user has provided specific context about modifying:
- `D:\java\frontend\ed-admin\src\views\assignments\components\QuestionManagementDrawer.vue`
- This appears to be related to a separate admin project and involves modifying question management functionality

### PM2 Deployment
The project includes PM2 ecosystem configuration for production deployment management.