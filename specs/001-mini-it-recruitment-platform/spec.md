# Feature Specification: Mini IT Recruitment Platform for Vietnam

**Feature Branch**: `001-mini-it-recruitment-platform`

**Created**: 2026-08-13

**Status**: Draft

**Input**: User description: "Build an application, which is a mini IT recruitment platform similar to ITviec, supporting stakeholders in Vietnam, including Candidates, Recruiters, Moderators, and Admins."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Candidate applies to IT roles and manages profile (Priority: P1)

A candidate in Vietnam can create an account, complete a professional profile, browse IT jobs, and submit applications to relevant openings. The platform should make it easy to match candidate skills to role requirements and track application progress.

**Why this priority**: This is the core value of the platform: job-seeking candidates need a trustworthy and efficient way to discover and apply for suitable IT opportunities.

**Independent Test**: A candidate can sign up, upload a CV, search for frontend/backend/mobile roles, apply to a role, and see the status update without needing recruiter or admin support.

**Acceptance Scenarios**:

1. **Given** a new candidate account, **When** the candidate completes profile details, uploads CV, and selects skills, **Then** the profile becomes searchable and application-ready.
2. **Given** a candidate is viewing a list of open positions, **When** they filter by city, skill, or job type, **Then** only relevant postings are displayed.
3. **Given** a candidate submits an application for a specific role, **When** the application is valid, **Then** the platform stores the application and shows a confirmation status.
4. **Given** a candidate has multiple applications, **When** they view their dashboard, **Then** each application shows current status such as Submitted, Reviewed, Interview, or Rejected.

---

### User Story 2 - Recruiter posts jobs and manages applicants (Priority: P1)

A recruiter can create company and job postings, define role requirements, and manage candidate applications through a structured workflow. The system should help recruiters review applicants efficiently and communicate hiring decisions.

**Why this priority**: Recruiters are the main commercial stakeholder; without a strong job-posting and applicant-management flow, the platform cannot sustain value for employers.

**Independent Test**: A recruiter can create a role, publish it, review candidates, and move applicants through the hiring pipeline without moderator or admin involvement.

**Acceptance Scenarios**:

1. **Given** a recruiter is logged in, **When** they create a job posting with title, location, salary, skills, and requirements, **Then** the job becomes visible to candidates in the relevant market and filters.
2. **Given** a recruiter views applicants for a posting, **When** they sort by score, experience, or newest application, **Then** the applicants are displayed in a meaningful order for review.
3. **Given** a recruiter updates an applicant status to Interview or Rejected, **When** the action is saved, **Then** the candidate sees the updated status in their dashboard.
4. **Given** a recruiter creates a duplicate or incomplete posting, **When** validation rules are triggered, **Then** the system prevents invalid data or displays actionable errors.

---

### User Story 3 - Moderator reviews suspicious or low-quality content (Priority: P2)

A moderator is responsible for reviewing suspicious job listings, fake profiles, inappropriate content, and reported issues to keep the platform trustworthy. Moderators need clear review tools and escalation routes.

**Why this priority**: Trust is essential for recruitment platforms; without moderation, spam, fraud, and low-quality content undermines both candidates and recruiters.

**Independent Test**: A moderator can review flagged listings or reports, approve or reject them, and enforce platform policies without needing admin intervention for routine moderation tasks.

**Acceptance Scenarios**:

1. **Given** a recruiter posts content that violates policy or is reported, **When** a moderator opens the moderation queue, **Then** they can view the report reason and the offending content.
2. **Given** a moderator rejects a job posting or profile, **When** the action is submitted, **Then** the content is hidden from public visibility and the reporter is notified if applicable.
3. **Given** a moderator approves a flagged item, **When** they finalize the review, **Then** the content remains active and the case is marked resolved.

---

### User Story 4 - Admin manages global governance and platform operations (Priority: P2)

An admin can manage system-wide settings, approve or deactivate recruiters, review metrics, and enforce platform policies across all user groups. Admins maintain governance and operational health for the platform.

**Why this priority**: Platform administrators protect the business model, support compliance, and resolve escalations beyond the capacity of moderators.

**Independent Test**: An admin can review platform activity, manage user roles, and take action on account or content issues that affect the business and trust layer.

**Acceptance Scenarios**:

1. **Given** a recruiter or moderator account requires verification, **When** the admin reviews the account, **Then** they can activate, suspend, or deactivate it.
2. **Given** the platform needs a policy change or configuration update, **When** the admin edits platform settings, **Then** the updated rules apply system-wide.
3. **Given** a user reports fraud or abusive behavior, **When** the admin reviews the case, **Then** they can take escalated actions such as restricting the user or requiring verification.

---

### Edge Cases

- What happens when a candidate uploads an invalid CV or unsupported file type?
- How does the system handle a recruiter posting a role in an unsupported city or with missing salary data?
- What happens when a candidate applies twice to the same job posting?
- How does the system handle a moderator or admin without permission trying to access restricted management views?
- What happens when a recruiter tries to post a job while their company profile is unverified?
- How does the system handle duplicate or suspicious profiles generated by the same user or company?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow candidates to create accounts, complete profiles, manage CVs, and save job-search preferences.
- **FR-002**: System MUST allow recruiters to create and manage company and job-posting information, including title, location, salary, skills, and requirements.
- **FR-003**: System MUST allow candidates to browse and filter job listings by location, skill, role type, experience level, and company.
- **FR-004**: System MUST allow candidates to submit one or more applications to open positions and view application status.
- **FR-005**: System MUST allow recruiters to review applicants, shortlist candidates, and update hiring stages such as Submitted, Reviewed, Interview, Offer, and Rejected.
- **FR-006**: System MUST allow moderators to review flagged job postings, suspicious profiles, and reported content and take action to approve or reject them.
- **FR-007**: System MUST allow admins to manage account status, role permissions, and platform governance settings across all stakeholders.
- **FR-008**: System MUST validate required job-posting fields before publication and show actionable validation errors.
- **FR-009**: System MUST prevent duplicate applications to the same role when the business rules require one application per candidate per job.
- **FR-010**: System MUST support role-based access control for Candidates, Recruiters, Moderators, and Admins with appropriate permission boundaries.
- **FR-011**: System MUST provide candidate and recruiter notifications for key events such as application submission, status changes, review decisions, and moderation outcomes.
- **FR-012**: System MUST support Vietnamese market requirements, including Vietnamese job titles, salary ranges, cities, and localization for content and user experience.
- **FR-013**: System MUST let moderators and admins view audit trails for key moderation and governance actions.
- **FR-014**: System MUST preserve privacy expectations for personal data, including CV files and contact details, by limiting access to authorized users.
- **FR-015**: System MUST support job-search and hiring workflows for IT-specific domains including software engineering, data, QA, infrastructure, product, and design roles.

### Key Entities *(include if feature involves data)*

- **Candidate**: A user seeking employment; includes profile, skills, CV, experience summary, saved job preferences, and application history.
- **Recruiter**: A user representing a company or hiring team; includes company association, permissions to publish jobs, and applicant review workflows.
- **Moderator**: A trusted review user who manages policy enforcement, flagged content, and platform safety operations.
- **Admin**: A platform-level user with access to governance, role management, security controls, and platform settings.
- **Company**: An employer entity represented in the platform; includes brand details, hiring profile, company size, and public company page.
- **Job Posting**: A published role listing with requirements, location, salary range, experience level, skills, and status.
- **Job Application**: A candidate's application to a job, including submission metadata, status timeline, and recruiter actions.
- **Report / Moderation Case**: A flagged issue or suspicious item requiring moderator or admin review; includes reason, subject, status, and resolution.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Candidates can create and complete an application-ready profile and submit at least one valid job application within 10 minutes in the supported use flow.
- **SC-002**: Recruiters can publish a new job posting and review applicants within 5 minutes after logging in.
- **SC-003**: Moderators can resolve the majority of flagged or low-quality submissions within 24 hours of escalation.
- **SC-004**: The platform supports at least 95% completion of critical onboarding and apply flows for first-time users through clear validation and feedback.
- **SC-005**: Access to privileged actions is correctly restricted so unauthorized users cannot manage or view sensitive recruiter or admin data.

## Assumptions

- Users have access to a modern web browser and stable internet connectivity for profile creation, job search, and application submission.
- The first release focuses on web-based functionality for the core recruitment workflow rather than mobile-first native apps.
- Existing identity or authentication infrastructure may be introduced later; in v1, the system can use a standard account model with role-based access control.
- The platform targets the Vietnamese IT labor market and should accommodate local hiring expectations, cities, and salary conventions.
- Moderation and admin workflows are required from the beginning because trust and governance are essential to recruitment marketplace credibility.
