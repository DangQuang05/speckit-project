# Data Model

## Core Entities

### User

Represents a person or authorized actor in the system.

**Fields**
- id: UUID
- email: string
- passwordHash: string
- fullName: string
- phoneNumber: string
- role: enum { CANDIDATE, RECRUITER, MODERATOR, ADMIN }
- isActive: boolean
- createdAt: datetime
- updatedAt: datetime

**Relationships**
- One-to-one with CandidateProfile when role is CANDIDATE
- One-to-many with JobPosting when role is RECRUITER
- One-to-many with ModerationCase when acting as reviewer or reporter

### CandidateProfile

Represents the professional profile for a candidate.

**Fields**
- id: UUID
- userId: UUID
- headline: string
- summary: string
- experienceYears: integer
- city: string
- skills: string[]
- cvUrl: string
- isAvailableForWork: boolean
- updatedAt: datetime

**Relationships**
- Many-to-one with User
- One-to-many with JobApplication

### Company

Represents an employer entity that posts jobs.

**Fields**
- id: UUID
- name: string
- website: string
- location: string
- industry: string
- description: string
- isVerified: boolean
- createdAt: datetime

**Relationships**
- One-to-many with JobPosting
- One-to-many with RecruiterProfile

### RecruiterProfile

Represents company-side recruitment access.

**Fields**
- id: UUID
- userId: UUID
- companyId: UUID
- positionTitle: string
- isVerified: boolean
- createdAt: datetime

**Relationships**
- Many-to-one with User
- Many-to-one with Company
- One-to-many with JobPosting

### JobPosting

Represents a published open role.

**Fields**
- id: UUID
- companyId: UUID
- recruiterId: UUID
- title: string
- location: string
- employmentType: enum { FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP }
- experienceLevel: enum { JUNIOR, MID, SENIOR, LEAD }
- salaryMin: decimal
- salaryMax: decimal
- description: text
- requirements: text[]
- skillsRequired: string[]
- status: enum { DRAFT, ACTIVE, CLOSED, REJECTED }
- createdAt: datetime
- updatedAt: datetime

**Relationships**
- Many-to-one with Company
- Many-to-one with RecruiterProfile
- One-to-many with JobApplication

### JobApplication

Represents a candidate application to a job.

**Fields**
- id: UUID
- jobId: UUID
- candidateProfileId: UUID
- status: enum { SUBMITTED, REVIEWED, INTERVIEW, OFFER, REJECTED }
- submittedAt: datetime
- lastUpdatedAt: datetime
- coverLetter: text

**Relationships**
- Many-to-one with JobPosting
- Many-to-one with CandidateProfile

### ModerationCase

Tracks reports and policy reviews.

**Fields**
- id: UUID
- subjectType: enum { JOB_POSTING, PROFILE, USER, COMPANY }
- subjectId: UUID
- reporterUserId: UUID
- moderatorUserId: UUID
- reason: string
- status: enum { OPEN, REVIEWED, RESOLVED, REJECTED }
- resolution: text
- createdAt: datetime
- resolvedAt: datetime

**Relationships**
- Many-to-one with User for reporter and moderator

### AuditLog

Represents a credentialed change or governance action.

**Fields**
- id: UUID
- actorUserId: UUID
- actionType: string
- entityType: string
- entityId: UUID
- details: json
- createdAt: datetime

**Relationships**
- Many-to-one with User

## Validation Rules

- User email must be unique and valid.
- Candidate profile must include at least one skill or headline.
- JobPosting requires title, location, description, and at least one employment type.
- JobApplication must not allow duplicate submissions for the same candidate and job when business rules require one application per role.
- ModerationCase requires a reporting reason and visible subject reference.
- Role-based actions must be checked server-side before state mutation.

## State Transitions

### JobApplication

SUBMITTED -> REVIEWED -> INTERVIEW -> OFFER / REJECTED

### ModerationCase

OPEN -> REVIEWED -> RESOLVED / REJECTED

### JobPosting

DRAFT -> ACTIVE -> CLOSED

REJECTED is a terminal state resulting from moderation or admin review
