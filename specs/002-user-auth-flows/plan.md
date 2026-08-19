# Implementation Plan: User Authentication Flows

**Branch**: `002-user-auth-flows` | **Date**: 2026-08-19 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-user-auth-flows/spec.md`

**Note**: This plan records the implementation design for the existing Spring Boot and React/Vite recruitment platform.

## Summary

Deliver login, registration, logout, protected navigation, and persistent authentication for the existing recruitment platform. The implementation keeps the existing Spring Boot API and React/Vite client, replaces the current mock-token and role-switching behavior with a real authenticated user flow, and adds server-side validation, account lockout, session expiry, and accessible authentication screens.

Registration is limited to Candidate and Recruiter. Moderator and Admin accounts remain provisioned administratively. The desktop-only v1 constraint from the specification is retained.

## Technical Context

**Language/Version**: Java 21 and JavaScript with React 19.2.8

**Primary Dependencies**: Spring Boot 3.4.1, Spring Web, Spring Data JPA, Spring Validation, Spring Security, BCrypt, React Router DOM 7, Vite 8, Vitest, Testing Library

**Storage**: Existing JPA `User` entity and repository with H2 runtime storage. Authentication state requires a server-verifiable session or signed token with a 24-hour sliding expiry; raw passwords are never stored.

**Testing**: Maven Surefire/JUnit 5/Mockito for backend service and controller tests; Vitest and Testing Library for frontend behavior; automated WCAG checks plus keyboard validation for the authentication screens.

**Target Platform**: Spring Boot backend on Java 21 and a desktop modern browser running the Vite React client. Viewports below 768px are out of scope for v1.

**Project Type**: Full-stack web application with a Spring Boot API and React single-page application

**Performance Goals**: Successful login or registration reaches the role dashboard within the specified user outcomes; duplicate submissions are prevented and authentication requests do not block the UI.

**Constraints**: Password policy is 8+ characters with uppercase, number, and special character. Lock an account after 5 consecutive failed attempts for at least 15 minutes. Do not disclose whether an email or password was incorrect. Enforce WCAG 2.1 AA on authentication screens and preserve form values on recoverable errors.

**Scale/Scope**: Three public authentication states (login, register, logout/session-expiry feedback), four role destinations, one existing `User` account model, and the existing dashboard views. Password reset, social login, and mobile layouts are excluded.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Quality by Default: PASS. Changes remain within the existing backend/frontend boundaries and use descriptive DTO, service, controller, and component layers.
- Test-First and Verification: PASS with implementation requirement. Each user-facing flow and lockout/session rule must have focused automated tests before merge.
- User Experience Consistency: PASS with implementation requirement. Auth screens reuse existing client styling conventions, expose field-level errors, support keyboard focus, and provide clear state feedback.
- Performance as a Product Requirement: PASS. Auth requests are bounded network actions, duplicate submissions are disabled, and dashboard loading is not duplicated after authentication.
- Simplicity and Maintainability: PASS. The feature extends the existing auth service, controller, API wrapper, and app flow without introducing a second application shell.
- Security and privacy: PASS with implementation requirement. The current mock token, permissive authorization rule, and client role switching are implementation gaps that this feature must replace with verifiable authentication and protected access.

## Project Structure

### Documentation (this feature)

```text
specs/002-user-auth-flows/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)
```text
backend/
├── src/
│   ├── main/java/com/project/recruitment/
│   │   ├── api/AuthController.java
│   │   ├── api/ApiExceptionHandler.java
│   │   ├── domain/User.java
│   │   ├── dto/{AuthResponse,LoginRequest,RegisterRequest}.java
│   │   ├── repository/UserRepository.java
│   │   ├── security/SecurityConfig.java
│   │   └── service/AuthService.java
│   └── test/java/com/project/recruitment/
│       ├── service/AuthServiceTest.java
│       └── api/AuthControllerTest.java
└── pom.xml

frontend/
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── components/{Header,AuthForm,LogoutControl}.jsx
│   ├── pages/{LoginPage,RegisterPage}.jsx
│   ├── services/api.js
│   └── auth/{authStorage,ProtectedRoute}.js
├── src/App.test.jsx
└── package.json
```

**Structure Decision**: Use the existing two-project web application layout. Backend authentication owns validation, account status, lockout counters, session issuance, expiry, and authorization. Frontend authentication owns forms, local session hydration, route guards, role routing, logout cleanup, and user-facing error states. Feature documentation remains under `specs/002-user-auth-flows/`.

## Complexity Tracking

No constitution violations are introduced. The security changes address gaps in the existing implementation rather than adding an avoidable abstraction.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

## Implementation Phases

### Phase 0: Research

- Confirm the existing auth endpoints, DTO validation, `User` persistence, BCrypt configuration, frontend API wrapper, and role view boundaries.
- Choose a server-verifiable authentication mechanism compatible with the current stateless Spring Security setup and a 24-hour sliding window.
- Define the error mapping needed to distinguish inactive accounts and lockout from generic invalid credentials without exposing account existence.

### Phase 1: Design

- Model account lockout and session lifecycle data without storing raw credentials.
- Document register, login, session validation, and logout contracts in `contracts/auth-api.yaml`.
- Document desktop validation scenarios, Maven/Vitest commands, and accessibility checks in `quickstart.md`.

### Phase 2: Implementation Readiness

- Backend: implement password policy, duplicate-email handling, failed-attempt tracking, lockout expiry, session issuance/validation/revocation, protected authorization, and focused tests.
- Frontend: add login/register views, validation and password guidance, session hydration, protected/guest route behavior, role routing, logout cleanup, and focused tests.
- Cross-cutting: add accessible focus/error semantics, prevent duplicate submits, preserve inputs after retryable failures, and validate the quickstart scenarios.

## Post-Design Constitution Re-check

- Quality by Default: PASS; documented contracts and local file ownership keep the change traceable.
- Test-First and Verification: PASS; `AuthServiceTest`, controller/API tests, React tests, and accessibility checks are required deliverables.
- User Experience Consistency: PASS; login, registration, logout, expiry, validation, and error states are explicitly specified.
- Performance as a Product Requirement: PASS; the client hydrates one session and disables in-flight submissions.
- Simplicity and Maintainability: PASS; no new top-level application or persistence technology is needed.
- Security and privacy: PASS with acceptance gate; no mock credentials/tokens, unrestricted protected routes, raw passwords, or account-enumerating login errors may remain in the completed slice.
