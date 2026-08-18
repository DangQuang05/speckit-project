# Quickstart Guide

## Prerequisites

- Java 21+
- Maven or Gradle
- Node.js 18+
- PostgreSQL 14+
- Git

## Backend Setup

1. Create a PostgreSQL database for the recruitment app.
2. Configure `backend/src/main/resources/application.yml` with database URL, username, and password.
3. Run:

```bash
cd backend
./mvnw spring-boot:run
```

4. Verify the backend is running on the configured port, such as `http://localhost:8080`.

## Frontend Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Start the Vite dev server:

```bash
npm run dev
```

3. Open the local frontend URL shown in the terminal, typically `http://localhost:5173`.

## Validation Scenarios

### Candidate Flow

- Sign up as a candidate
- Complete profile and upload CV
- Search for backend or frontend jobs
- Apply to a role
- Check application status dashboard

### Recruiter Flow

- Sign in as a recruiter
- Create a company and job posting
- Review applications for that job
- Update a candidate to Interview or Rejected

### Moderator Flow

- Review a reported job or suspicious profile
- Approve or reject the moderation case
- Confirm the public content is hidden or restored as appropriate

### Admin Flow

- Manage user activation and role access
- Review audit logs or moderation escalations
- Apply governance rules and platform controls

## Expected Outcome

These flows validate the MVP business value of the platform: job discovery, recruiter hiring operations, platform safety, and administrative governance.
