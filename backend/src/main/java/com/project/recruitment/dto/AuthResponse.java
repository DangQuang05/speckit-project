package com.project.recruitment.dto;

import com.project.recruitment.domain.UserRole;

public record AuthResponse(
    String token,
    Long userId,
    String email,
    String fullName,
    UserRole role
) {
}
