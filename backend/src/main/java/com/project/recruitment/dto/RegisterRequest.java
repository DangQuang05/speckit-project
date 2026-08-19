package com.project.recruitment.dto;

import com.project.recruitment.domain.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    String email,

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @jakarta.validation.constraints.Pattern(
        regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$",
        message = "Password must include an uppercase letter, a number, and a special character"
    )
    String password,

    @NotBlank(message = "Full name is required")
    String fullName,

    String phoneNumber,

    @NotNull(message = "Role is required")
    UserRole role
) {
}
