package com.project.recruitment.dto;

import com.project.recruitment.domain.EmploymentType;
import com.project.recruitment.domain.ExperienceLevel;
import com.project.recruitment.domain.JobStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record JobPostingRequest(
    Long companyId,
    String companyName,

    @NotBlank(message = "Job title is required")
    String title,

    @NotBlank(message = "Location/City is required")
    String location,

    @NotNull(message = "Employment type is required")
    EmploymentType employmentType,

    ExperienceLevel experienceLevel,

    Integer salaryMin,
    Integer salaryMax,
    String salaryText,

    @NotBlank(message = "Job description is required")
    String description,

    List<String> requirements,

    @NotEmpty(message = "At least one skill is required")
    List<String> skillsRequired,

    JobStatus status
) {
}
