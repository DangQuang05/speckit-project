package com.project.recruitment.dto;

import com.project.recruitment.domain.SubjectType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ModerationReportRequest(
    @NotNull(message = "Subject type is required")
    SubjectType subjectType,

    @NotNull(message = "Subject ID is required")
    Long subjectId,

    String subjectTitle,

    @NotBlank(message = "Report reason is required")
    String reason
) {
}
