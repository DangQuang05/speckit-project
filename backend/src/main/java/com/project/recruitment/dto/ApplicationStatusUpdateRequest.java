package com.project.recruitment.dto;

import com.project.recruitment.domain.JobApplicationStatus;
import jakarta.validation.constraints.NotNull;

public record ApplicationStatusUpdateRequest(
    @NotNull(message = "Status is required")
    JobApplicationStatus status,
    String feedback
) {
}
