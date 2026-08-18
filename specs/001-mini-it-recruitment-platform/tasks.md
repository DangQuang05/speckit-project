# Tasks: Mini IT Recruitment Platform for Vietnam

**Input**: Design documents from `/specs/001-mini-it-recruitment-platform/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the monorepo structure and shared configuration for the frontend and backend.

- [X] T001 Create root project structure with `backend/` and `frontend/` directories per implementation plan
- [X] T002 Initialize the Spring Boot backend project in `backend/` with Java 21, Maven, and required dependencies
- [X] T003 Initialize the Vite React frontend in `frontend/` with minimal dependencies for routing, HTTP, and app state
- [X] T004 [P] Configure shared environment configuration and base project conventions for both services
- [X] T005 [P] Configure code quality tooling for backend and frontend (formatter/linter if applicable)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the shared infrastructure required before any role-specific feature work begins.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Set up PostgreSQL connection and application configuration in `backend/src/main/resources/application.yml`
- [X] T007 Implement base backend package structure under `backend/src/main/java/com/project/recruitment/`
- [X] T008 Implement data model entities for `User`, `Company`, `JobPosting`, `JobApplication`, `ModerationCase`, and `AuditLog`
- [X] T009 [P] Configure JPA repositories for the core entities in `backend/src/main/java/com/project/recruitment/repository/`
- [X] T010 Implement security foundation and role-based access control in `backend/src/main/java/com/project/recruitment/security/`
- [X] T011 Configure global exception handling, validation, and standardized API response patterns in `backend/src/main/java/com/project/recruitment/config/` and `backend/src/main/java/com/project/recruitment/api/`
- [X] T012 Set up backend service layer scaffolding and DTOs for user, job, application, and moderation flows in `backend/src/main/java/com/project/recruitment/dto/` and `service/`
- [X] T013 Configure frontend API client, app shell, and route structure in `frontend/src/`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Candidate applies to IT roles and manages profile (Priority: P1) 🎯 MVP

**Goal**: Enable candidate account setup, profile creation, job discovery, and application submission.

### Implementation for User Story 1

- [X] T014 [P] [US1] Implement candidate registration and authentication endpoints in `backend/src/main/java/com/project/recruitment/controller/`
- [X] T015 [P] [US1] Implement candidate profile CRUD and CV metadata handling in `backend/src/main/java/com/project/recruitment/service/`
- [X] T016 [US1] Implement job listing and filtering APIs for candidate search in `backend/src/main/java/com/project/recruitment/controller/` and `service/`
- [X] T017 [US1] Implement job application creation and status tracking logic in `backend/src/main/java/com/project/recruitment/service/`
- [X] T018 [US1] Expose application and profile endpoints using DTOs and validation rules from the data model and API contract
- [X] T019 [P] [US1] Create candidate pages and forms in `frontend/src/pages/` for sign up, login, profile, and dashboard
- [X] T020 [P] [US1] Create reusable candidate UI components in `frontend/src/components/` for job cards, filter controls, and application status views
- [X] T021 [US1] Implement frontend candidate API client and state management for profile, search, and application actions in `frontend/src/services/` and `frontend/src/features/`
- [X] T022 [US1] Connect frontend flows to backend endpoints for registration, profile update, job search, and application submission
- [X] T023 [US1] Validate candidate flow against the quickstart scenarios and ensure role-based restrictions are enforced

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Recruiter posts jobs and manages applicants (Priority: P1)

**Goal**: Let recruiters create company profiles, publish jobs, and manage candidate pipelines.

### Implementation for User Story 2

- [X] T024 [P] [US2] Implement recruiter registration and company association logic in `backend/src/main/java/com/project/recruitment/service/`
- [X] T025 [US2] Implement company and recruiter profile APIs in `backend/src/main/java/com/project/recruitment/controller/`
- [X] T026 [US2] Implement job creation, editing, and publication logic with validation in `backend/src/main/java/com/project/recruitment/service/`
- [X] T027 [US2] Implement recruiter applicant review workflow and status transitions for job applications in `backend/src/main/java/com/project/recruitment/service/`
- [X] T028 [US2] Add recruiter-specific authorization and ownership checks for company and applicant actions
- [X] T029 [P] [US2] Build recruiter dashboard, job creation form, and applicant review pages in `frontend/src/pages/`
- [X] T030 [P] [US2] Build recruiter UI components for application list, candidate cards, and job posting summary in `frontend/src/components/`
- [X] T031 [US2] Implement frontend recruiter API integration and state handling in `frontend/src/services/` and `frontend/src/features/`
- [X] T032 [US2] Validate recruiter actions, status updates, and validation rules against business requirements

**Checkpoint**: User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - Moderator reviews suspicious or low-quality content (Priority: P2)

**Goal**: Provide moderators with a reporting and review workflow that preserves trust and platform quality.

### Implementation for User Story 3

- [X] T033 [P] [US3] Implement moderation case model and reporting workflow in `backend/src/main/java/com/project/recruitment/service/`
- [X] T034 [US3] Add moderation endpoints for queue listing, review, approval, and rejection in `backend/src/main/java/com/project/recruitment/controller/`
- [X] T035 [US3] Implement action auditing and traceability for moderation decisions in `backend/src/main/java/com/project/recruitment/service/`
- [X] T036 [US3] Enforce moderator-only authorization and secure access to moderation data in backend security rules
- [X] T037 [P] [US3] Build moderator dashboard and review screens in `frontend/src/pages/` and `frontend/src/components/`
- [X] T038 [US3] Implement frontend moderation API calls and case resolution UI in `frontend/src/services/` and `frontend/src/features/`
- [X] T039 [US3] Validate moderator review paths end-to-end with report and content resolution scenarios

**Checkpoint**: Moderator workflow should be independently functional and reviewable

---

## Phase 6: User Story 4 - Admin manages global governance and platform operations (Priority: P2)

**Goal**: Give admins governance controls over user roles, account status, and platform-level policy enforcement.

### Implementation for User Story 4

- [X] T040 [P] [US4] Implement admin account management and role update APIs in `backend/src/main/java/com/project/recruitment/controller/`
- [X] T041 [US4] Implement platform governance services for activation, suspension, and audit review in `backend/src/main/java/com/project/recruitment/service/`
- [X] T042 [US4] Add admin-only access enforcement and audit logging for privileged actions
- [X] T043 [P] [US4] Build admin dashboard and user management screens in `frontend/src/pages/`
- [X] T044 [US4] Implement frontend admin API connections and management actions in `frontend/src/services/` and `frontend/src/features/`
- [X] T045 [US4] Validate admin flows for account activation, role changes, and governance review decisions

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Ensure the application is consistent, secure, and ready to validate as a complete MVP.

- [X] T046 [P] Review and align frontend UI state, copy, and interaction patterns across all role views in `frontend/src/`
- [X] T047 Review and harden backend security rules for candidate, recruiter, moderator, and admin permissions
- [X] T048 [P] Add missing validation and error messaging across forms and API responses
- [X] T049 Improve search, filtering, and dashboard performance for candidate and recruiter listings
- [X] T050 [P] Update documentation and run the validation guide in `specs/001-mini-it-recruitment-platform/quickstart.md`
- [X] T051 Final QA pass for critical flows: candidate apply, recruiter review, moderator case resolution, and admin governance

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story phases (3-6)**: Depend on Foundational completion
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Candidate features can start after Foundational
- **User Story 2 (P1)**: Recruiter features can start after Foundational
- **User Story 3 (P2)**: Moderator review workflow can start after Foundational
- **User Story 4 (P2)**: Admin governance can start after Foundational

### Within Each User Story

- Core data and service layers before API exposure
- API exposure before frontend integration
- Frontend screens before validation of the full role flow

### Parallel Opportunities

- Setup tasks marked [P] can run in parallel
- Foundational tasks marked [P] can run in parallel
- Different role stories can proceed concurrently after Phase 2
- Frontend view and backend API tasks for the same story can proceed in parallel with clear ownership boundaries

---

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational work
2. Complete User Story 1 for candidate onboarding and job applications
3. Validate the MVP independently
4. Add recruiter capabilities, then moderator and admin controls
5. Finish with cross-cutting polish and validation

### Incremental Delivery

1. Build foundation
2. Ship candidate-facing MVP
3. Add recruiter lifecycle and hiring workflows
4. Add trust and governance workflows with moderation and admin controls
5. Finish quality and performance pass
