# Data Model: User Authentication Flows

## User Account

Existing persistence boundary: `backend/src/main/java/com/project/recruitment/domain/User.java`.

| Field | Type | Rules |
|---|---|---|
| id | Long | Generated primary key |
| email | String | Required, valid format, normalized lowercase, unique |
| password | String | Required BCrypt hash; raw password is never persisted or returned |
| fullName | String | Required and non-blank |
| role | UserRole | Required; self-registration permits only `CANDIDATE` or `RECRUITER`; `MODERATOR` and `ADMIN` are provisioned |
| enabled | boolean | Active account flag; false means suspended/deactivated |
| failedLoginAttempts | integer | Consecutive failed credential count, default 0 |
| lockedUntil | datetime | Nullable; attempts are rejected while in the future |
| createdAt | datetime | Account creation timestamp |
| updatedAt | datetime | Last account update timestamp |

If the existing schema is not migrated for lockout fields, add a focused JPA-compatible migration or schema update rather than keeping the counter in browser storage.

## Authenticated Session

A server-verifiable credential represents the active session.

| Field | Type | Rules |
|---|---|---|
| token | opaque signed value | Stored client-side only as an authentication credential; never expose password data |
| userId | Long | Derived from the authenticated account |
| role | UserRole | Derived from the account and checked server-side on protected requests |
| issuedAt | datetime | Credential issue time |
| lastActivityAt | datetime | Renewed on authenticated activity |
| expiresAt | datetime | 24 hours after last activity |
| revoked | boolean | Logout and invalidation make the credential unusable |

The concrete persistence strategy may be a signed token with revocation support or a server-side session record, but it must support validation, sliding expiry, logout revocation, and server-side role checks.

## Authentication Credential

Input-only request data:

- `email`: required, valid email format, normalized before lookup.
- `password`: required; never logged, persisted, or echoed in an error response.
- `fullName`: registration-only required field.
- `role`: registration-only and limited to Candidate or Recruiter.

## State Transitions

### Login attempts

```text
active + valid credentials -> authenticated session, failedLoginAttempts = 0
active + invalid credentials -> failedLoginAttempts + 1
failedLoginAttempts reaches 5 -> lockedUntil = now + at least 15 minutes
lockedUntil in future -> locked response, no credential validation disclosure
lockedUntil elapsed -> normal login handling; a valid login clears the counter
inactive account -> inactive-account response; no session
```

### Session lifecycle

```text
no credential -> guest
valid credential + activity before expiry -> authenticated and expiry renewed
expired or revoked credential -> guest with session-expired feedback
logout -> revoke/clear credential and return to guest
```

## Validation and Privacy Rules

- Registration rejects duplicate normalized email addresses.
- Registration enforces at least 8 characters, one uppercase letter, one number, and one special character.
- Login uses a generic invalid-credentials message for unknown email and wrong password.
- Inactive and locked states have actionable messages without exposing lockout duration or remaining attempts.
- API responses never contain password hashes, raw passwords, session secrets, or internal exception details.
