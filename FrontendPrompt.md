
# Prompt

In the `frontend2` directory, use the **Stitch MCP server** to retrieve the design assets from my project **"Snip Product Design Brief"**.

Build a **fully responsive React + Tailwind CSS v4** application that faithfully reproduces the design's visual language, layout, spacing, typography, colors, and overall Design DNA. The implementation should closely match the original component hierarchy, interactions, and user experience across desktop, tablet, and mobile breakpoints.

The backend has already been implemented and is available in the `backend` directory. **Inspect the backend before writing frontend code** to understand the available endpoints, DTOs, request/response payloads, authentication flow, validation rules, error handling, and API contracts. Integrate the frontend with the existing backend APIs rather than mocking data.

Do **not** modify the backend unless absolutely necessary. If an API is missing, clearly identify it before making any backend changes.

For the **Teams** page only, reproduce the design exactly as provided and use mock API calls since the backend functionality for teams has not yet been implemented.

---

# Project Structure

Use the following scalable feature-based directory structure.

```text
src
│
├── assets
│
├── pages
│   ├── auth
│   │   ├── login
│   │   │   ├── login.tsx
│   │   │   ├── components
│   │   │   ├── hooks
│   │   │   ├── validation.ts
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   │
│   │   ├── register
│   │   │   ├── register.tsx
│   │   │   ├── components
│   │   │   ├── hooks
│   │   │   ├── validation.ts
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   │
│   │   ├── forgot-password
│   │   │   ├── forgot-password.tsx
│   │   │   ├── components
│   │   │   ├── hooks
│   │   │   ├── validation.ts
│   │   │   └── types.ts
│   │   │
│   │   └── reset-password
│   │       ├── reset-password.tsx
│   │       ├── components
│   │       ├── hooks
│   │       ├── validation.ts
│   │       └── types.ts
│   │
│   ├── url-shortener
│   │   ├── dashboard
│   │   │   ├── dashboard.tsx
│   │   │   ├── components
│   │   │   ├── hooks
│   │   │   ├── types.ts
│   │   │   ├── constants.ts
│   │   │   └── utils.ts
│   │   │
│   │   ├── urls
│   │   │   ├── urls.tsx
│   │   │   ├── components
│   │   │   ├── hooks
│   │   │   ├── validation.ts
│   │   │   ├── types.ts
│   │   │   ├── constants.ts
│   │   │   └── utils.ts
│   │   │
│   │   ├── analytics
│   │   │   ├── analytics.tsx
│   │   │   ├── components
│   │   │   ├── hooks
│   │   │   ├── types.ts
│   │   │   ├── constants.ts
│   │   │   └── utils.ts
│   │   │
│   │   ├── teams
│   │   │   ├── teams.tsx
│   │   │   ├── components
│   │   │   ├── hooks
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   │
│   │   ├── settings
│   │   │   ├── settings.tsx
│   │   │   ├── components
│   │   │   ├── hooks
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   │
│   │   ├── profile
│   │   │   ├── profile.tsx
│   │   │   ├── components
│   │   │   ├── hooks
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   │
│   │   └── workspace
│   │       ├── workspace.tsx
│   │       ├── components
│   │       ├── hooks
│   │       ├── types.ts
│   │       └── utils.ts
│   │
│   └── not-found
│       └── not-found.tsx
│
├── lib
│   ├── api
│   ├── components
│   │   └── common
│   │       ├── layout
│   │       ├── navigation
│   │       ├── ui
│   │       ├── forms
│   │       ├── modals
│   │       ├── feedback
│   │       └── data-display
│   │
│   ├── hooks
│   ├── stores
│   ├── providers
│   ├── validation
│   ├── utils
│   ├── constants
│   ├── types
│   └── config
│
├── router
├── styles
├── App.tsx
└── main.tsx
```

Group pages with similar functionality into the same feature folder (for example, `auth/login` and `auth/register`).

---

# Architecture

Follow a clean, scalable architecture.

* Organize code by feature rather than file type where appropriate.
* Build the UI from small, reusable, composable components.
* Avoid duplicated UI, business logic, or styling.
* Separate:

  * Presentation
  * Business logic
  * API communication
  * State management
  * Utility functions
* Keep components focused on a single responsibility.
* Prefer composition over inheritance.

---

# State Management

Use **Zustand** for client-side global state only.

Organize stores by feature.

Examples include:

* Authentication
* Theme
* Workspace
* Sidebar/UI state

Use **TanStack Query** for server state, API caching, mutations, and synchronization.

Do **not** duplicate server state inside Zustand unless absolutely necessary.

---

# API Layer

Use **Axios** for all HTTP requests.

Create a centralized API layer under:

```text
src/lib/api
```

Create reusable Axios instances with:

* Base URL configuration
* Request interceptors
* Response interceptors
* Authentication token handling
* Automatic token refresh (if supported by the backend)
* Automatic error normalization
* Timeout configuration

Organize API files by feature instead of using a single API file.

Example:

```text
api
├── client.ts
├── auth.ts
├── urls.ts
├── analytics.ts
├── users.ts
├── workspaces.ts
└── teams.ts
```

Consume the existing backend endpoints rather than hardcoding or mocking responses.

Keep API endpoints centralized so they can be changed in one location.

---

# Authentication

Implement the authentication flow based entirely on the backend implementation.

Include:

* Login
* Registration
* Logout
* Token persistence
* Protected routes
* Route guards
* Automatic inclusion of authentication tokens
* Handling expired or invalid tokens
* Redirecting unauthenticated users appropriately

---

# Design System

Create a centralized design system.

Include:

* Color palette
* Typography
* Font families
* Font sizes
* Font weights
* Fluid spacing scale
* Border radius
* Shadows
* Breakpoints
* Container widths
* Z-index scale
* Animation durations
* Transition timings

Use CSS variables wherever appropriate.

Use `clamp()` for typography and spacing to create fluid, responsive sizing that closely matches the Stitch design across all viewport sizes.

Avoid arbitrary values whenever a design token exists.

---

# Tailwind CSS

Configure Tailwind CSS v4 to consume the design system values whenever possible.

Avoid scattering arbitrary utility values throughout the application.

Keep styling consistent and token-driven.

---

# Path Aliases

Configure the following aliases:

```text
@src/*
@lib/*
@components/*
@pages/*
@hooks/*
@stores/*
@utils/*
@api/*
@styles/*
@types/*
```

---

# Code Quality

Use **TypeScript** throughout.

Follow React and TypeScript best practices.

Write production-ready, maintainable code.

Ensure components are:

* Accessible (ARIA where appropriate)
* Reusable
* Composable
* Strongly typed
* Easy to extend

Avoid unnecessary re-renders by using memoization where appropriate.

Implement proper:

* Loading states
* Empty states
* Success states
* Error states
* Skeleton loaders where appropriate

---

# Responsiveness

The application must be fully responsive.

Support:

* Mobile
* Tablet
* Desktop
* Large desktop

Use fluid layouts with Flexbox and CSS Grid where appropriate.

Prefer relative units (`rem`, `%`, `vw`, `clamp()`) over fixed pixel values unless necessary to preserve the Stitch design.

---

# Integration Requirements

Before implementing any UI:

1. Review the backend project.
2. Understand the available endpoints.
3. Match DTOs and validation rules.
4. Match authentication behavior.
5. Match error responses.
6. Integrate with the backend APIs.

Do not modify backend APIs unless absolutely necessary.

Keep the frontend decoupled so API endpoints can be changed in a single location.

For the **Teams** page only, implement the UI exactly as designed while using mocked API calls until the backend becomes available.

---

# Implementation Order

Implement the application incrementally in the following order:

1. Configure project architecture.
2. Configure routing.
3. Configure Tailwind and the design system.
4. Configure Axios and the API layer.
5. Configure Zustand.
6. Configure TanStack Query.
7. Configure authentication.
8. Build reusable UI components.
9. Implement layouts and navigation.
10. Build feature pages one feature at a time.
11. Integrate each feature with the backend before moving to the next.
12. Ensure the application builds successfully after each major feature is completed.

---

# Expected Output

Produce a production-ready frontend that:

* Faithfully matches the Stitch design.
* Preserves the original Design DNA.
* Uses reusable, composable React components.
* Includes a centralized design system.
* Integrates seamlessly with the existing backend.
* Uses Axios for API communication.
* Uses Zustand for client-side global state.
* Uses TanStack Query for server state and caching.
* Is fully responsive using fluid typography and spacing with `clamp()`.
* Is scalable, maintainable, easy to extend, and follows modern React architecture and best practices.
