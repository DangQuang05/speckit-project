package com.project.recruitment.domain;

import java.time.LocalDateTime;

public class ModerationCase {
    private Long id;
    private SubjectType subjectType;
    private Long subjectId;
    private String subjectTitle;
    private Long reporterUserId;
    private String reporterName;
    private Long moderatorUserId;
    private String reason;
    private ModerationStatus status = ModerationStatus.OPEN;
    private String resolution;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime resolvedAt;

    public ModerationCase() {
    }

    public ModerationCase(Long id, SubjectType subjectType, Long subjectId, String subjectTitle,
                          Long reporterUserId, String reporterName, String reason) {
        this.id = id;
        this.subjectType = subjectType;
        this.subjectId = subjectId;
        this.subjectTitle = subjectTitle;
        this.reporterUserId = reporterUserId;
        this.reporterName = reporterName;
        this.reason = reason;
        this.status = ModerationStatus.OPEN;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public SubjectType getSubjectType() { return subjectType; }
    public void setSubjectType(SubjectType subjectType) { this.subjectType = subjectType; }

    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }

    public String getSubjectTitle() { return subjectTitle; }
    public void setSubjectTitle(String subjectTitle) { this.subjectTitle = subjectTitle; }

    public Long getReporterUserId() { return reporterUserId; }
    public void setReporterUserId(Long reporterUserId) { this.reporterUserId = reporterUserId; }

    public String getReporterName() { return reporterName; }
    public void setReporterName(String reporterName) { this.reporterName = reporterName; }

    public Long getModeratorUserId() { return moderatorUserId; }
    public void setModeratorUserId(Long moderatorUserId) { this.moderatorUserId = moderatorUserId; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public ModerationStatus getStatus() { return status; }
    public void setStatus(ModerationStatus status) { this.status = status; }

    public String getResolution() { return resolution; }
    public void setResolution(String resolution) { this.resolution = resolution; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
}
