package com.project.recruitment.api;

import com.project.recruitment.domain.User;
import com.project.recruitment.domain.UserRole;
import com.project.recruitment.dto.AuthResponse;
import com.project.recruitment.dto.LoginRequest;
import com.project.recruitment.dto.RegisterRequest;
import com.project.recruitment.security.AuthTokenService;
import com.project.recruitment.repository.UserRepository;
import com.project.recruitment.repository.UserSessionRepository;
import com.project.recruitment.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

class AuthControllerTest {
    // Controller tests use real auth services to remain compatible with Java 25.
    private AuthService authService;
    private AuthTokenService tokenService;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private UserSessionRepository sessionRepository;
    private AuthController controller;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        sessionRepository = mock(UserSessionRepository.class);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(7L);
            return user;
        });
        authService = new AuthService(userRepository, passwordEncoder, new AuthTokenService(sessionRepository, 24));
        tokenService = new AuthTokenService(sessionRepository, 24);
        controller = new AuthController(authService, tokenService);
    }

    @Test
    void registerReturnsAuthenticatedResponse() {
        var result = controller.register(new RegisterRequest("new@example.com", "Valid123!", "New User", null, UserRole.CANDIDATE));

        assertEquals(201, result.getStatusCode().value());
        assertNotNull(result.getBody());
        assertEquals("new@example.com", result.getBody().data().email());
    }

    @Test
    void invalidSessionReturnsUnauthorized() {
        when(tokenService.authenticate("bad-token")).thenReturn(Optional.empty());

        var result = controller.session("Bearer bad-token");

        assertEquals(401, result.getStatusCode().value());
    }

    @Test
    void logoutRevokesBearerToken() {
        var result = controller.logout("Bearer token");

        verify(sessionRepository).findByTokenHash(anyString());
        assertEquals(204, result.getStatusCode().value());
    }
}
