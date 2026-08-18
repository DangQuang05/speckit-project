package com.project.recruitment.dto;

import jakarta.validation.constraints.NotBlank;

public record JobApplicationRequest(
    String coverLetter,
    String skillsSummary,
    String cvUrl
) {
}
