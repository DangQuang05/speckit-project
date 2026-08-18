package com.project.recruitment.dto;

import jakarta.validation.constraints.NotBlank;

public record CompanyRequest(
    @NotBlank(message = "Company name is required")
    String name,
    String website,
    @NotBlank(message = "Location is required")
    String location,
    String industry,
    String description
) {
}
