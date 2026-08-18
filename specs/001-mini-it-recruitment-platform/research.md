# Research Summary

## Decisions

### Decision: Use React + Vite for the frontend with a minimal dependency set

- The frontend will be built with React.js and Vite to keep the UI fast, lightweight, and easy to iterate.
- The dependency profile will remain minimal: routing, HTTP client, and app-level state only where needed.
- This supports a fast development cycle and fits the requirement for a lean frontend stack.

**Rationale**: Vite offers quick bootstrapping, strong DX, and efficient frontend builds. React matches the need for reusable components and a manageable SPA structure.

**Alternatives considered**:
- Next.js: heavier framework overhead for a small MVP with no clear SSR need.
- Vue or Angular: viable, but the user specifically requested React.js.

### Decision: Use Spring Boot in Java for the backend

- The backend will expose REST APIs for authentication, jobs, applications, moderation, and admin workflows.
- Spring Boot provides a mature, production-appropriate Java ecosystem for service layering, validation, and secured APIs.

**Rationale**: The app requires role-based permissions, structured persistence, and enterprise-friendly patterns. Spring Boot is a strong fit and aligns with the backend requirement.

**Alternatives considered**:
- Node.js/NestJS: acceptable, but the user explicitly specified Spring Boot.
- Serverless functions: not suitable for the full admin and recruitment workflow complexity.

### Decision: Use PostgreSQL as the system of record

- Structured job data, user accounts, applications, moderation actions, and company metadata will reside in PostgreSQL.
- This supports consistent filtering, joins, and business queries across candidate and recruiter flows.

**Rationale**: Recruitment workflows need relational data integrity and efficient querying across users, jobs, applications, and moderation cases.

**Alternatives considered**:
- MongoDB: flexible, but relational data and permission modeling fit better in PostgreSQL.
- SQLite: sufficient for prototypes but not appropriate for a multi-role service platform.

### Decision: Model role-based access by user type and permission mapping

- Candidate, recruiter, moderator, and admin roles will each have distinct permission sets.
- Access to company, moderation, and administrative actions will be guarded through backend authorization checks.

**Rationale**: The production requirement is not just login but safe domain-specific permissions. This is essential for trust and governance.

**Alternatives considered**:
- Single shared-role model: insufficient for the platform’s governance requirements.
- Client-only enforcement: not acceptable from a security standpoint.

### Decision: Keep moderation and application status transitions explicit

- Candidate applications and recruiter actions should use a finite set of statuses.
- Moderation cases will track the reporting context, review decisions, and resolution timeline.

**Rationale**: Clear state transitions improve UX, support auditability, and reduce ambiguity in hiring workflows.

**Alternatives considered**:
- Free-form statuses: difficult to validate and harder to audit.
- No moderation queue: not viable for marketplace trust and safety.

## Open Questions Resolved

- Frontend framework: React.js with Vite
- Backend framework: Spring Boot (Java)
- Data layer: PostgreSQL
- Core actors: Candidate, Recruiter, Moderator, Admin
- MVP boundaries: Job posting, candidate application, moderation, and admin governance workflows

## Risks and Mitigations

- Risk: role confusion across candidate/recruiter/admin flows
  - Mitigation: centralized permission checks and user-role mapping in backend services
- Risk: poor trust and safety due to spam or suspicious listings
  - Mitigation: moderation queue and review actions built into the MVP
- Risk: poor UX from inconsistent candidate and recruiter states
  - Mitigation: shared design patterns and explicit status models on both frontend and backend
- Risk: performance degradation on search and dashboard screens
  - Mitigation: indexed query fields, service-layer filtering, and limited screen complexity in MVP scope
