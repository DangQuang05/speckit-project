package com.project.recruitment.dto;

import com.project.recruitment.domain.ModerationStatus;
import jakarta.validation.constraints.NotNull;

public record ModerationResolutionRequest(
    @NotNull(message = "Status is required")
    ModerationStatus status,

    String resolution
) {
}
