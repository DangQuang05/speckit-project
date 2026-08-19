package com.project.recruitment.dto;

import com.project.recruitment.domain.UserRole;

import java.time.LocalDateTime;

public record AuthResponse(
    String token,
    Long userId,
    String email,
    String fullName,
    UserRole role,
    LocalDateTime expiresAt
) {
    public AuthResponse(String token, Long userId, String email, String fullName, UserRole role) {
        this(token, userId, email, fullName, role, null);
    }
}
