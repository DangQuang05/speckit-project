package com.project.recruitment.domain;

import java.time.LocalDateTime;

public class RecruiterProfile {
    private Long id;
    private Long userId;
    private Long companyId;
    private String positionTitle;
    private boolean verified = false;
    private LocalDateTime createdAt = LocalDateTime.now();

    public RecruiterProfile() {
    }

    public RecruiterProfile(Long id, Long userId, Long companyId, String positionTitle, boolean verified) {
        this.id = id;
        this.userId = userId;
        this.companyId = companyId;
        this.positionTitle = positionTitle;
        this.verified = verified;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public String getPositionTitle() { return positionTitle; }
    public void setPositionTitle(String positionTitle) { this.positionTitle = positionTitle; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
