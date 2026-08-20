# Implementation Plan: Mini IT Recruitment Platform for Vietnam

**Branch**: `001-mini-it-recruitment-platform` | **Date**: 2026-08-13 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-mini-it-recruitment-platform/spec.md`

## Summary

Build a lightweight IT recruitment marketplace for Vietnam that connects candidates, recruiters, moderators, and admins through a responsive web application. The frontend will use React.js with Vite and a minimal dependency stack for quick UX iteration, while the backend will use Spring Boot in Java to manage authentication, authorization, job listings, applications, moderation, and platform administration. The design emphasizes clear job discovery, structured application workflows, role-based access control, moderation safety, and a smooth user experience suited to the Vietnamese IT labor market.

## Technical Context

**Language/Version**: Java 21, React.js 18+, Vite 5+

**Primary Dependencies**: Spring Boot 3.x, Spring Security, Spring Data JPA, PostgreSQL, React Router, Axios, Vite, minimal UI/build tooling

**Storage**: PostgreSQL for primary data persistence; file storage or object storage for CV uploads and documents

**Testing**: JUnit 5 + Spring Boot Test for backend; Vitest + React Testing Library for frontend; optional Playwright for UI smoke coverage

**Target Platform**: Web application optimized for desktop and responsive tablet/mobile browsers

**Project Type**: Web application with separate frontend and backend services

**Performance Goals**: Candidate browse and job search pages load quickly; recruiter dashboards remain responsive with moderate dataset sizes; moderation queues and application updates process in near real time for user expectations

**Constraints**: Support Vietnamese localization, role-based authorization, protected personal data, moderate concurrency, no unnecessary third-party libraries, maintain a lean stack for rapid delivery

**Scale/Scope**: MVP handling job listings, candidate profiles, recruiter operations, moderation, and administrative controls for a regional IT hiring marketplace

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Code Quality: PASS — a small, explicit architecture with clear service boundaries supports readability and maintainability.
- Testing Standards: PASS — backend and frontend layers will include validation tests for critical flows and regression coverage.
- User Experience Consistency: PASS — shared design tokens, consistent layouts, and clear states are required for all user-facing workflows.
- Performance Requirements: PASS — the solution avoids unnecessary libraries, keeps search and dashboard queries efficient, and treats responsiveness as a user-facing requirement.
- Simplicity: PASS — the system uses a straightforward React + Spring Boot split without speculative complexity.

## Project Structure

### Documentation (this feature)

```text
specs/001-mini-it-recruitment-platform/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── main/
│   │   ├── java/com/project/recruitment/
│   │   │   ├── api/
│   │   │   ├── config/
│   │   │   ├── controller/
│   │   │   ├── domain/
│   │   │   ├── dto/
│   │   │   ├── repository/
│   │   │   ├── security/
│   │   │   ├── service/
│   │   │   └── util/
│   │   └── resources/
│   │       ├── application.yml
│   │       └── validation/
│   └── test/java/com/project/recruitment/
├── pom.xml
└── README.md

frontend/
├── src/
│   ├── auth/
│   │   ├── authStorage.js
│   │   ├── GuestRoute.jsx
│   │   └── ProtectedRoute.jsx
│   ├── components/
│   │   ├── ApplyModal.jsx
│   │   ├── Header.jsx
│   │   ├── JobCard.jsx
│   │   ├── JobDetailModal.jsx
│   │   ├── LogoutControl.jsx
│   │   ├── NotificationsDrawer.jsx
│   │   ├── ReportModal.jsx
│   │   └── Toast.jsx
│   ├── pages/
│   │   ├── AdminView.jsx
│   │   ├── CandidateDashboard.jsx
│   │   ├── CandidateView.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ModeratorView.jsx
│   │   ├── RecruiterView.jsx
│   │   └── RegisterPage.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
├── vite.config.js
└── index.html
```

## UI/UX Design System (Taste Skill Compliance)

- **Archetype**: Minimalist SaaS (Linear / Vercel design philosophy).
- **Design Tokens**: Defined in `frontend/src/index.css` with CSS custom properties for neutral scales (`#fafafa`, `#ffffff`, `#e5e5e5`, `#171717`, `#525252`, `#737373`), single accent `#2563eb`, and crisp semantic indicators.
- **Component Standard**: All inline styles eliminated; UI components use structured CSS classes, segment controls, subtle badges, uppercase table headers, and backdrop-filter modals.
- **Typography & Iconography**: Google Fonts Inter with tight heading tracking, zero emoji clutter in buttons/headers, and accessible text labels.

**Structure Decision**: Split the application into separate frontend and backend projects under a shared monorepo root. This matches the stated stack, keeps concerns isolated, and simplifies role-based logic and API contracts.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations identified. The selected architecture remains within the project quality, performance, and simplicity standards.

