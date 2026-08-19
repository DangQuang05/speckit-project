# Quickstart: User Authentication Flows

## Prerequisites

- Java 21 and Maven available on `PATH`.
- Node.js and npm available on `PATH`.
- H2 runtime database configured by the existing backend.

## Start the application

From the repository root:

```powershell
cd backend
mvn spring-boot:run
```

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL in a desktop browser.

## Automated validation

Backend:

```powershell
cd backend
mvn test
```

Frontend:

```powershell
cd frontend
npm test
npm run lint
npm run build
```

## Acceptance scenarios

1. Open the login page as a guest. Register a new Candidate with a unique email and a password satisfying all four rules. Confirm the user reaches the Candidate view without a second login.
2. Repeat registration with the same email. Confirm a clear duplicate-email message and preserved form values.
3. Submit registration with blank name, invalid email, and weak password. Confirm field-level messages and password criteria guidance.
4. Log in with each provisioned role and confirm the dashboard is selected from the authenticated response, not a client role switcher.
5. Refresh the browser while authenticated. Confirm the session is restored within its validity window.
6. Submit wrong credentials. Confirm one generic invalid-credentials message that does not identify the incorrect field.
7. Disable an account through the existing admin flow, then attempt login. Confirm the inactive-account message and no authenticated view.
8. Submit five consecutive failed logins for one account. Confirm subsequent attempts are rejected with a lockout message that does not reveal remaining duration or exact threshold.
9. Use the visible logout control from every authenticated role view. Confirm local auth data is removed, the login page is shown, and direct navigation to a protected view returns to login.
10. Exercise login, registration, logout, and session-expiry states with keyboard only. Confirm visible focus, labels, error associations, and automated WCAG 2.1 AA checks pass.

Detailed request and response shapes are in [contracts/auth-api.yaml](contracts/auth-api.yaml). Entity and lifecycle rules are in [data-model.md](data-model.md).
