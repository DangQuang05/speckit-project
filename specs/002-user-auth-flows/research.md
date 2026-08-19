# Research: User Authentication Flows

## Decision: Extend the existing Spring Boot authentication boundary

- **Decision**: Keep `AuthController`, `AuthService`, `UserRepository`, the existing DTO records, BCrypt `PasswordEncoder`, and the React `services/api.js` wrapper as the owning boundaries.
- **Rationale**: The repository already exposes `/auth/register` and `/auth/login`, persists `User`, hashes passwords with BCrypt, and renders role-specific views. Extending these boundaries minimizes migration risk and preserves current public contracts.
- **Alternatives considered**: Adding a separate identity service or replacing the client API layer was rejected because the feature is a focused authentication flow and the current application is a single backend/frontend project.

## Decision: Use server-verifiable bearer sessions with sliding expiry

- **Decision**: Issue a signed, server-verifiable authentication credential from login and registration, validate it on protected requests, renew the 24-hour inactivity window on authenticated activity, and revoke/clear it on logout. The browser stores only the credential and non-sensitive user display data needed to hydrate the shell.
- **Rationale**: The current API is configured as stateless and currently returns a mock token. A verifiable credential preserves that deployment model while preventing client-side role spoofing. The expiry behavior directly implements the specification's 24-hour sliding window.
- **Alternatives considered**: Server HTTP session cookies would require changing the current stateless setup and cross-origin configuration. A client-only local role flag is not authentication and was rejected.

## Decision: Enforce password and lockout rules on the server, mirror guidance on the client

- **Decision**: Validate the full password policy in the backend DTO/service boundary. The frontend mirrors the same rules for immediate field guidance but treats the backend response as authoritative. Track consecutive failures and lockout-until state per account; reject attempts during a lockout and reset the counter only after a successful login.
- **Rationale**: Client validation improves usability but cannot enforce security. Server-side state is required for the five-attempt threshold across browsers and devices.
- **Alternatives considered**: Browser-only counters were rejected because users can clear storage or switch devices. A global IP-only throttle was rejected because it does not satisfy the per-account requirement and can unfairly affect shared networks.

## Decision: Keep authentication errors safe and actionable

- **Decision**: Return one non-specific invalid-credentials response for unknown emails and wrong passwords. Return separate inactive-account and locked-account messages because the specification requires those user actions, without exposing lockout duration or exact threshold details in the UI.
- **Rationale**: This meets the security requirement while giving suspended users and locked users a path forward.
- **Alternatives considered**: Exposing "email not found" or remaining lockout time was rejected because it increases account enumeration and timing/data leakage.

## Decision: Use guest and protected route guards in the React shell

- **Decision**: Hydrate authentication once at app startup, redirect authenticated users away from login/register, redirect unauthenticated users to login, and select the dashboard from the server-provided role.
- **Rationale**: The existing `App.jsx` always starts with a hard-coded candidate and lets any client switch role. Route guards and server-derived role state are required for FR-006, FR-007, FR-012, and FR-013.
- **Alternatives considered**: Keeping the role switcher as a demo control was rejected because it bypasses authorization and creates a false authenticated state.

## Decision: Validate accessibility as a release gate

- **Decision**: Use native labels and controls, `aria-invalid`, `aria-describedby`, a live error summary or alert, visible focus styles, keyboard-only flows, and automated accessibility checks for login, registration, and logout/session-expiry states.
- **Rationale**: WCAG 2.1 AA is an explicit functional requirement, not a later polish item.
- **Alternatives considered**: Visual-only review was rejected because it cannot reliably detect keyboard, labeling, or assistive-technology failures.
