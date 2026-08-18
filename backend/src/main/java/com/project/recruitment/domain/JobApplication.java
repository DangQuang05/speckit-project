package com.project.recruitment.domain;

import java.time.LocalDateTime;

public class JobApplication {
    private Long id;
    private Long candidateProfileId;
    private Long candidateUserId;
    private String candidateName;
    private String candidateEmail;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private String coverLetter;
    private String skillsSummary;
    private String cvUrl;
    private JobApplicationStatus status = JobApplicationStatus.SUBMITTED;
    private LocalDateTime submittedAt = LocalDateTime.now();
    private LocalDateTime lastUpdatedAt = LocalDateTime.now();

    public JobApplication() {
    }

    public JobApplication(Long id, Long candidateProfileId, Long candidateUserId, String candidateName,
                          String candidateEmail, Long jobId, String jobTitle, String companyName,
                          String coverLetter, String skillsSummary, String cvUrl, JobApplicationStatus status) {
        this.id = id;
        this.candidateProfileId = candidateProfileId;
        this.candidateUserId = candidateUserId;
        this.candidateName = candidateName;
        this.candidateEmail = candidateEmail;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.companyName = companyName;
        this.coverLetter = coverLetter;
        this.skillsSummary = skillsSummary;
        this.cvUrl = cvUrl;
        this.status = status != null ? status : JobApplicationStatus.SUBMITTED;
        this.submittedAt = LocalDateTime.now();
        this.lastUpdatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCandidateProfileId() { return candidateProfileId; }
    public void setCandidateProfileId(Long candidateProfileId) { this.candidateProfileId = candidateProfileId; }

    public Long getCandidateUserId() { return candidateUserId; }
    public void setCandidateUserId(Long candidateUserId) { this.candidateUserId = candidateUserId; }

    public String getCandidateName() { return candidateName; }
    public void setCandidateName(String candidateName) { this.candidateName = candidateName; }

    public String getCandidateEmail() { return candidateEmail; }
    public void setCandidateEmail(String candidateEmail) { this.candidateEmail = candidateEmail; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getCoverLetter() { return coverLetter; }
    public void setCoverLetter(String coverLetter) { this.coverLetter = coverLetter; }

    public String getSkillsSummary() { return skillsSummary; }
    public void setSkillsSummary(String skillsSummary) { this.skillsSummary = skillsSummary; }

    public String getCvUrl() { return cvUrl; }
    public void setCvUrl(String cvUrl) { this.cvUrl = cvUrl; }

    public JobApplicationStatus getStatus() { return status; }
    public void setStatus(JobApplicationStatus status) { this.status = status; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public LocalDateTime getLastUpdatedAt() { return lastUpdatedAt; }
    public void setLastUpdatedAt(LocalDateTime lastUpdatedAt) { this.lastUpdatedAt = lastUpdatedAt; }
}
