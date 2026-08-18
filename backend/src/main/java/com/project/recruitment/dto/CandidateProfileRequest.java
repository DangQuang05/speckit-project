package com.project.recruitment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record CandidateProfileRequest(
    @NotBlank(message = "Headline is required")
    String headline,

    @NotBlank(message = "Summary is required")
    String summary,

    Integer experienceYears,

    @NotBlank(message = "City is required")
    String city,

    @NotEmpty(message = "At least one skill is required")
    List<String> skills,

    String cvUrl,

    boolean availableForWork,

    String savedPreferences
) {
}
