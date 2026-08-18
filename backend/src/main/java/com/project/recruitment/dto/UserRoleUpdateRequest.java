package com.project.recruitment.dto;

import com.project.recruitment.domain.UserRole;
import jakarta.validation.constraints.NotNull;

public record UserRoleUpdateRequest(
    @NotNull(message = "Role is required")
    UserRole role
) {
}
