package com.project.recruitment.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class CandidateProfile {
    private Long id;
    private Long userId;
    private String headline;
    private String summary;
    private Integer experienceYears;
    private String city;
    private List<String> skills = new ArrayList<>();
    private String cvUrl;
    private boolean availableForWork = true;
    private String savedPreferences;
    private LocalDateTime updatedAt = LocalDateTime.now();

    public CandidateProfile() {
    }

    public CandidateProfile(Long userId, String headline, String summary, Integer experienceYears,
                            String city, List<String> skills, String cvUrl, boolean availableForWork) {
        this.userId = userId;
        this.headline = headline;
        this.summary = summary;
        this.experienceYears = experienceYears;
        this.city = city;
        this.skills = skills == null ? new ArrayList<>() : new ArrayList<>(skills);
        this.cvUrl = cvUrl;
        this.availableForWork = availableForWork;
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills == null ? new ArrayList<>() : new ArrayList<>(skills); }

    public String getCvUrl() { return cvUrl; }
    public void setCvUrl(String cvUrl) { this.cvUrl = cvUrl; }

    public boolean isAvailableForWork() { return availableForWork; }
    public void setAvailableForWork(boolean availableForWork) { this.availableForWork = availableForWork; }

    public String getSavedPreferences() { return savedPreferences; }
    public void setSavedPreferences(String savedPreferences) { this.savedPreferences = savedPreferences; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
