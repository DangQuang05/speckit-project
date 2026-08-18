package com.project.recruitment.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class JobPosting {
    private Long id;
    private Long companyId;
    private String companyName;
    private Long recruiterId;
    private String title;
    private String location;
    private EmploymentType employmentType = EmploymentType.FULL_TIME;
    private ExperienceLevel experienceLevel = ExperienceLevel.MID;
    private Integer salaryMin;
    private Integer salaryMax;
    private String salaryText;
    private String description;
    private List<String> requirements = new ArrayList<>();
    private List<String> skillsRequired = new ArrayList<>();
    private JobStatus status = JobStatus.ACTIVE;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public JobPosting() {
    }

    public JobPosting(Long id, Long companyId, String companyName, Long recruiterId, String title,
                      String location, EmploymentType employmentType, ExperienceLevel experienceLevel,
                      Integer salaryMin, Integer salaryMax, String salaryText, String description,
                      List<String> requirements, List<String> skillsRequired, JobStatus status) {
        this.id = id;
        this.companyId = companyId;
        this.companyName = companyName;
        this.recruiterId = recruiterId;
        this.title = title;
        this.location = location;
        this.employmentType = employmentType != null ? employmentType : EmploymentType.FULL_TIME;
        this.experienceLevel = experienceLevel != null ? experienceLevel : ExperienceLevel.MID;
        this.salaryMin = salaryMin;
        this.salaryMax = salaryMax;
        this.salaryText = salaryText;
        this.description = description;
        this.requirements = requirements != null ? new ArrayList<>(requirements) : new ArrayList<>();
        this.skillsRequired = skillsRequired != null ? new ArrayList<>(skillsRequired) : new ArrayList<>();
        this.status = status != null ? status : JobStatus.ACTIVE;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public Long getRecruiterId() { return recruiterId; }
    public void setRecruiterId(Long recruiterId) { this.recruiterId = recruiterId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public EmploymentType getEmploymentType() { return employmentType; }
    public void setEmploymentType(EmploymentType employmentType) { this.employmentType = employmentType; }

    public ExperienceLevel getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(ExperienceLevel experienceLevel) { this.experienceLevel = experienceLevel; }

    public Integer getSalaryMin() { return salaryMin; }
    public void setSalaryMin(Integer salaryMin) { this.salaryMin = salaryMin; }

    public Integer getSalaryMax() { return salaryMax; }
    public void setSalaryMax(Integer salaryMax) { this.salaryMax = salaryMax; }

    public String getSalaryText() { return salaryText; }
    public void setSalaryText(String salaryText) { this.salaryText = salaryText; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getRequirements() { return requirements; }
    public void setRequirements(List<String> requirements) { this.requirements = requirements != null ? new ArrayList<>(requirements) : new ArrayList<>(); }

    public List<String> getSkillsRequired() { return skillsRequired; }
    public void setSkillsRequired(List<String> skillsRequired) { this.skillsRequired = skillsRequired != null ? new ArrayList<>(skillsRequired) : new ArrayList<>(); }

    public JobStatus getStatus() { return status; }
    public void setStatus(JobStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
