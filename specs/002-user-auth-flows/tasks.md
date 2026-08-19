---

description: "Executable task list for user authentication flows"
---

# Tasks: User Authentication Flows

**Input**: Design documents from `/specs/002-user-auth-flows/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [quickstart.md](quickstart.md), [contracts/auth-api.yaml](contracts/auth-api.yaml)

**Tests**: Included because the feature specification defines mandatory acceptance scenarios and the project constitution requires automated verification for user-facing behavior.

**Project layout**: Spring Boot backend in `backend/` and React/Vite frontend in `frontend/`.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the existing backend and frontend projects for the authentication implementation.

- [X] T001 Confirm Spring Security, validation, JPA, and BCrypt dependencies in `backend/pom.xml` and add only dependencies required for signed or server-verifiable sessions.
- [ ] T002 Confirm React Router, Vitest, Testing Library, and accessibility-test dependencies in `frontend/package.json` and add the smallest required test dependency for WCAG checks.
- [X] T003 [P] Add authentication API base URL and non-secret session configuration in `backend/src/main/resources/application.yml`.
- [ ] T004 [P] Add authentication-related test and build scripts in `frontend/package.json` without changing existing job or dashboard scripts.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared account, session, security, error, and client-state infrastructure required by all user stories.

**Checkpoint**: No user story work can begin until protected API access, session lifecycle, and client auth hydration are available.

- [X] T005 Add consecutive-login-failure and lockout-expiry fields with safe defaults to `backend/src/main/java/com/project/recruitment/domain/User.java`.
- [X] T006 [P] Create the server-verifiable session entity and persistence boundary in `backend/src/main/java/com/project/recruitment/domain/UserSession.java` and `backend/src/main/java/com/project/recruitment/repository/UserSessionRepository.java`.
- [X] T007 [P] Create authentication credential and session validation helpers in `backend/src/main/java/com/project/recruitment/security/AuthTokenService.java` using a configured secret and 24-hour sliding expiry.
- [X] T008 Implement bearer credential extraction, validation, expiry renewal, and authenticated-user context in `backend/src/main/java/com/project/recruitment/security/AuthTokenFilter.java`.
- [X] T009 Configure protected-route authorization, public auth endpoints, CORS, and the authentication filter in `backend/src/main/java/com/project/recruitment/security/SecurityConfig.java`.
- [X] T010 Extend structured API error mapping for field validation, generic invalid credentials, inactive accounts, lockout, expired sessions, and duplicate email responses in `backend/src/main/java/com/project/recruitment/api/ApiExceptionHandler.java`.
- [X] T011 [P] Create browser session read/write/clear helpers that never store passwords in `frontend/src/auth/authStorage.js`.
- [X] T012 [P] Add authenticated request headers, auth endpoints, and normalized error handling in `frontend/src/services/api.js` while preserving existing fallback behavior for non-authenticated demo APIs.
- [X] T013 [P] Create the protected and guest route guard components in `frontend/src/auth/ProtectedRoute.jsx` and `frontend/src/auth/GuestRoute.jsx`.
- [ ] T014 Add backend service test fixtures for active, inactive, duplicate, failed-login, locked, and expired-session accounts in `backend/src/test/java/com/project/recruitment/service/AuthServiceTest.java`.
- [ ] T015 [P] Add frontend auth test setup and storage cleanup between tests in `frontend/src/setupTests.js`.

---

## Phase 3: User Story 1 - New User Registration (Priority: P1) - MVP

**Goal**: A new Candidate or Recruiter can register with clear validation, receive an authenticated session immediately, and reach the correct role view.

**Independent Test**: A new visitor submits valid registration data and reaches the selected role dashboard without a second login; duplicate, invalid, weak-password, and retryable-error cases preserve valid input and show actionable feedback.

### Tests for User Story 1

- [ ] T016 [P] [US1] Add registration service tests for unique email, normalized duplicate email, Candidate/Recruiter role limits, BCrypt hashing, and immediate session response in `backend/src/test/java/com/project/recruitment/service/AuthServiceTest.java`.
- [ ] T017 [P] [US1] Add registration controller contract tests for 201 success, 400 field errors, and 409 duplicate email in `backend/src/test/java/com/project/recruitment/api/AuthControllerTest.java`.
- [ ] T018 [P] [US1] Add registration form tests for field-level errors, password criteria guidance, preserved values, disabled duplicate submits, and successful role routing in `frontend/src/pages/RegisterPage.test.jsx`.

### Implementation for User Story 1

- [X] T019 [US1] Enforce full name, normalized email, Candidate/Recruiter role, and 8-character uppercase-number-special-character password validation in `backend/src/main/java/com/project/recruitment/dto/RegisterRequest.java`.
- [X] T020 [US1] Implement duplicate detection, password hashing, account creation, lockout-default initialization, and session issuance in `backend/src/main/java/com/project/recruitment/service/AuthService.java`.
- [X] T021 [US1] Return the documented registration response and safe domain data from `backend/src/main/java/com/project/recruitment/api/AuthController.java`.
- [X] T022 [US1] Implement accessible registration fields, role selection, live password guidance, field errors, retry handling, and loading-state submission protection in `frontend/src/pages/RegisterPage.jsx`.
- [X] T023 [US1] Add guest registration routing and authenticated post-registration role rendering in `frontend/src/App.jsx`.
- [X] T024 [US1] Add registration layout, focus indicators, error styling, and desktop constraints in `frontend/src/App.css` and `frontend/src/index.css`.

**Checkpoint**: User Story 1 is independently testable with backend and frontend tests and can deliver the MVP registration journey.

---

## Phase 4: User Story 2 - Returning User Login (Priority: P1)

**Goal**: An existing user can log in securely, see the dashboard for the server-assigned role, retain the session across refreshes, and receive safe inactive, invalid, or locked-account feedback.

**Independent Test**: An existing account logs in with valid credentials and reaches its role dashboard; refresh restores the session; invalid, inactive, and locked cases do not expose sensitive account details.

### Tests for User Story 2

- [ ] T025 [P] [US2] Add login service tests for valid credentials, generic unknown-email/wrong-password errors, inactive accounts, five-failure lockout, lockout expiry, counter reset, and session renewal in `backend/src/test/java/com/project/recruitment/service/AuthServiceTest.java`.
- [ ] T026 [P] [US2] Add login, session, and protected-endpoint controller tests for documented 200, 401, 403, and generic error responses in `backend/src/test/java/com/project/recruitment/api/AuthControllerTest.java`.
- [ ] T027 [P] [US2] Add login form tests for generic errors, inactive/locked messages, preserved input, loading-state double-submit prevention, and keyboard submission in `frontend/src/pages/LoginPage.test.jsx`.
- [ ] T028 [P] [US2] Add app hydration tests for valid session restore, expired session redirect, guest redirect, and role-specific dashboard rendering in `frontend/src/App.test.jsx`.

### Implementation for User Story 2

- [X] T029 [US2] Implement credential authentication, inactive-account handling, failed-attempt tracking, lockout enforcement, and successful counter reset in `backend/src/main/java/com/project/recruitment/service/AuthService.java`.
- [X] T030 [US2] Add login and current-session endpoints matching `specs/002-user-auth-flows/contracts/auth-api.yaml` in `backend/src/main/java/com/project/recruitment/api/AuthController.java`.
- [X] T031 [US2] Implement accessible login fields, generic credential errors, inactive/locked feedback, retry handling, and duplicate-submit protection in `frontend/src/pages/LoginPage.jsx`.
- [X] T032 [US2] Add startup session hydration, guest/protected route redirects, server-role dashboard selection, and session-expiry messaging in `frontend/src/App.jsx`.
- [X] T033 [US2] Remove hard-coded role switching and demo users from `frontend/src/components/Header.jsx` and render navigation from the authenticated user context.

**Checkpoint**: User Stories 1 and 2 both work independently, with registration-created sessions and login-restored sessions using the same protected shell.

---

## Phase 5: User Story 3 - User Logout (Priority: P2)

**Goal**: Any authenticated user can log out from any role view, revoke the server session, clear local auth state, and lose access to protected content.

**Independent Test**: A logged-in user selects logout, returns to the login screen within two seconds, has local auth data removed, and is redirected back to login when directly requesting a protected view.

### Tests for User Story 3

- [ ] T034 [P] [US3] Add logout and session-revocation service tests for valid, expired, and already-revoked sessions in `backend/src/test/java/com/project/recruitment/service/AuthServiceTest.java`.
- [ ] T035 [P] [US3] Add logout controller tests for successful revocation and unauthenticated requests in `backend/src/test/java/com/project/recruitment/api/AuthControllerTest.java`.
- [ ] T036 [P] [US3] Add logout component and protected-route tests for local cleanup, redirect, direct protected navigation, and session-expiry messaging in `frontend/src/components/LogoutControl.test.jsx` and `frontend/src/auth/ProtectedRoute.test.jsx`.

### Implementation for User Story 3

- [X] T037 [US3] Implement session revocation and logout response handling in `backend/src/main/java/com/project/recruitment/api/AuthController.java` and `backend/src/main/java/com/project/recruitment/service/AuthService.java`.
- [X] T038 [US3] Add a visible accessible logout control and confirmation/session-expiry action in `frontend/src/components/LogoutControl.jsx`.
- [X] T039 [US3] Connect logout to API revocation, browser storage clearing, auth context reset, and login navigation in `frontend/src/App.jsx` and `frontend/src/services/api.js`.
- [X] T040 [US3] Enforce protected content redirect after logout and guest-page redirect for authenticated users in `frontend/src/auth/ProtectedRoute.jsx` and `frontend/src/auth/GuestRoute.jsx`.

**Checkpoint**: All three user stories are independently functional and protected content is unavailable after logout or session expiry.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Complete accessibility, security, documentation, and regression validation across the authentication slice.

- [ ] T041 [P] Add WCAG-focused tests for labels, focus visibility, `aria-invalid`, `aria-describedby`, live errors, contrast, and keyboard-only flows in `frontend/src/auth/AuthAccessibility.test.jsx`.
- [ ] T042 [P] Add API contract assertions against `specs/002-user-auth-flows/contracts/auth-api.yaml` in `backend/src/test/java/com/project/recruitment/api/AuthContractTest.java`.
- [X] T043 Review authenticated controllers and replace client-supplied identity/role trust with server-authenticated context in `backend/src/main/java/com/project/recruitment/api/JobController.java`, `backend/src/main/java/com/project/recruitment/api/CandidateProfileController.java`, `backend/src/main/java/com/project/recruitment/api/RecruiterController.java`, `backend/src/main/java/com/project/recruitment/api/ModerationController.java`, and `backend/src/main/java/com/project/recruitment/api/AdminController.java`.
- [ ] T044 [P] Remove authentication secrets, raw credentials, mock tokens, and auth debug output from `backend/src/main/java/com/project/recruitment/` and `frontend/src/`.
- [ ] T045 [P] Update the runnable authentication checks and expected outcomes in `specs/002-user-auth-flows/quickstart.md` after implementation commands stabilize.
- [ ] T046 Run backend tests and build from `backend/pom.xml`, then run frontend tests, lint, and build from `frontend/package.json` and record any unrelated baseline failures in the implementation report.

## Phase 7: Convergence

**Purpose**: Close remaining gaps identified by comparing the current implementation with the feature specification, plan, and constitution.

- [X] T047 Replace client-supplied `X-User-Id` and default actor identities with the authenticated Spring principal and enforce role checks in `backend/src/main/java/com/project/recruitment/api/AdminController.java`, `backend/src/main/java/com/project/recruitment/api/CandidateProfileController.java`, `backend/src/main/java/com/project/recruitment/api/JobApplicationController.java`, `backend/src/main/java/com/project/recruitment/api/JobController.java`, and `backend/src/main/java/com/project/recruitment/api/ModerationController.java` per FR-011, FR-012, and the project security constraint (contradicts).
- [X] T048 Integrate `frontend/src/auth/ProtectedRoute.jsx` and `frontend/src/auth/GuestRoute.jsx` into URL/navigation handling so direct protected navigation, authenticated access to login/register, refresh restoration, logout, and expiry all enforce FR-006, FR-012, and FR-013 (partial).
- [ ] T049 Add an automated WCAG 2.1 AA test dependency and implement keyboard, focus, label, error-association, contrast, logout, and session-expiry checks in `frontend/src/auth/AuthAccessibility.test.jsx` per FR-015, SC-006, and Constitution II (missing).
- [ ] T050 Add backend controller and frontend behavior tests for duplicate registration, field validation, generic invalid credentials, inactive accounts, lockout, session restoration, logout revocation, protected navigation, and retry-preserved inputs in `backend/src/test/java/com/project/recruitment/api/AuthControllerTest.java`, `frontend/src/pages/RegisterPage.test.jsx`, `frontend/src/pages/LoginPage.test.jsx`, `frontend/src/components/LogoutControl.test.jsx`, and `frontend/src/auth/ProtectedRoute.test.jsx` per US1/AC2-AC4, US2/AC2-AC4, and US3/AC1-AC3 (missing).
- [ ] T051 Add contract/integration assertions for inactive and locked account status codes, five-attempt lockout, 24-hour sliding renewal, expired sessions, logout revocation, and duplicate-email responses in `backend/src/test/java/com/project/recruitment/api/AuthContractTest.java` per FR-003, FR-006, FR-009, FR-014, and `contracts/auth-api.yaml` (partial).
- [X] T052 Add an accessible logout confirmation or explicit confirmation state and test its keyboard operation and post-logout feedback in `frontend/src/components/LogoutControl.jsx` and `frontend/src/components/LogoutControl.test.jsx` per FR-010, FR-011, and FR-015 (partial).

## Phase 8: Convergence

**Purpose**: Close the remaining verification gaps after the security and navigation convergence pass.

- [X] T053 Install an automated WCAG 2.1 AA test dependency and add keyboard, focus, label, error-association, contrast, logout, and session-expiry assertions in `frontend/package.json`, `frontend/package-lock.json`, and `frontend/src/auth/AuthAccessibility.test.jsx` per FR-015, SC-006, and Constitution II (missing).
- [X] T054 Add backend and frontend acceptance tests for duplicate registration, field validation, generic invalid credentials, inactive accounts, lockout, session restoration, protected navigation, logout revocation, and retry-preserved inputs in `backend/src/test/java/com/project/recruitment/api/AuthControllerTest.java`, `frontend/src/pages/RegisterPage.test.jsx`, `frontend/src/pages/LoginPage.test.jsx`, and `frontend/src/auth/ProtectedRoute.test.jsx` per US1/AC2-AC4, US2/AC2-AC4, and US3/AC1-AC3 (missing).
- [X] T055 Add API contract/integration assertions for 400/401/403/409 responses, five-attempt lockout, 24-hour sliding renewal, expired sessions, logout revocation, and duplicate-email handling in `backend/src/test/java/com/project/recruitment/api/AuthContractTest.java` per FR-003, FR-006, FR-009, FR-014, and `contracts/auth-api.yaml` (missing).
- [X] T056 Run and record the complete backend and frontend validation suite from `specs/002-user-auth-flows/quickstart.md`, including Maven tests/build, Vitest, ESLint, and Vite build, using a reliable command invocation that exposes exit status and failures per Constitution II and SC-006 (partial).

## Phase 9: Convergence

**Purpose**: Establish an authoritative final validation result after the implementation and test artifacts are complete.

- [X] T057 Run the complete backend and frontend validation suite from `specs/002-user-auth-flows/quickstart.md` in isolated commands, capture each exit status and test report, resolve any failures, and mark the validation tasks complete per Constitution II and SC-006 (partial).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; confirms the existing build and test surfaces.
- **Foundational (Phase 2)**: Depends on Setup; blocks all user stories because every story needs protected API access and client session state.
- **User Story 1 (Phase 3)**: Depends on Phase 2. This is the suggested MVP increment.
- **User Story 2 (Phase 4)**: Depends on Phase 2 and shares the session/auth shell from US1; its service behavior can be tested independently.
- **User Story 3 (Phase 5)**: Depends on the session issued by Phase 2 and the authenticated shell completed by US1/US2.
- **Polish (Phase 6)**: Depends on all desired stories being implemented.

### User Story Dependencies

- **US1 Registration (P1)**: Can begin after Phase 2; no dependency on completed US2 or US3.
- **US2 Login (P1)**: Can begin after Phase 2; uses the same session contract as US1 but is independently testable with a pre-existing account.
- **US3 Logout (P2)**: Requires the session contract and authenticated shell from Phase 2; integrates with the login/registration state created by US1 and US2.

### Within Each User Story

- Write focused tests before implementation and make them fail for the missing behavior.
- Complete DTO/model changes before service changes, service changes before controller changes, and core API behavior before frontend integration.
- Run the story-specific backend and frontend tests at each checkpoint.

## Parallel Opportunities

- Phase 1: T003 and T004 can run in parallel after dependency inspection.
- Phase 2: T006, T007, T011, T012, T013, and T015 touch independent files and can run in parallel; T008 and T009 follow the security helper design.
- US1: T016, T017, and T018 can be written in parallel; T022 and T024 can proceed in parallel after the form contract is agreed.
- US2: T025, T026, T027, and T028 can be written in parallel; T031 can proceed independently from backend T029/T030 once the response contract is fixed.
- US3: T034, T035, and T036 can be written in parallel; T038 can proceed in parallel with backend logout work after the endpoint contract is fixed.
- Polish: T041, T042, T044, and T045 can run in parallel after the shared auth behavior is stable.

## Parallel Example: User Story 1

```text
Task T016: Backend registration service tests in backend/src/test/java/com/project/recruitment/service/AuthServiceTest.java
Task T017: Registration controller tests in backend/src/test/java/com/project/recruitment/api/AuthControllerTest.java
Task T018: Registration form tests in frontend/src/pages/RegisterPage.test.jsx
```

## Parallel Example: User Story 2

```text
Task T025: Backend login and lockout tests in backend/src/test/java/com/project/recruitment/service/AuthServiceTest.java
Task T027: Login form tests in frontend/src/pages/LoginPage.test.jsx
Task T028: Session hydration tests in frontend/src/App.test.jsx
```

## Parallel Example: User Story 3

```text
Task T034: Backend logout service tests in backend/src/test/java/com/project/recruitment/service/AuthServiceTest.java
Task T035: Logout controller tests in backend/src/test/java/com/project/recruitment/api/AuthControllerTest.java
Task T036: Logout and route guard tests in frontend/src/components/LogoutControl.test.jsx and frontend/src/auth/ProtectedRoute.test.jsx
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 Setup.
2. Complete Phase 2 Foundational session, security, and client-state work.
3. Complete Phase 3 User Story 1 registration.
4. Run the registration backend/frontend tests and the first four quickstart scenarios.
5. Stop for validation/demo before expanding to returning-user login.

### Incremental Delivery

1. Deliver Setup + Foundational as the authenticated platform foundation.
2. Add US1 registration and validate the MVP independently.
3. Add US2 login, session restore, inactive-account handling, and lockout.
4. Add US3 logout, revocation, and protected-route enforcement.
5. Complete accessibility, contract, security, and full build validation.

### Final Acceptance Criteria

- Registration, login, and logout flows meet the acceptance scenarios in `spec.md`.
- All server responses match `contracts/auth-api.yaml` and never expose raw credentials or account-enumerating login errors.
- Session expiry, five-attempt lockout, and logout revocation are server-enforced.
- Authentication screens pass automated accessibility checks and keyboard-only validation.
- Every task above has an exact file path, sequential ID, and required checklist/story labeling.
