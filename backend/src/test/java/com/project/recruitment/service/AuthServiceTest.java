package com.project.recruitment.service;

import com.project.recruitment.domain.User;
import com.project.recruitment.domain.UserRole;
import com.project.recruitment.dto.AuthResponse;
import com.project.recruitment.dto.LoginRequest;
import com.project.recruitment.dto.RegisterRequest;
import com.project.recruitment.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class AuthServiceTest {
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        userRepository = Mockito.mock(UserRepository.class);
        passwordEncoder = Mockito.mock(PasswordEncoder.class);
        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");
        authService = new AuthService(userRepository, passwordEncoder);
    }

    @Test
    void shouldRegisterNewCandidate() {
        when(userRepository.findByEmail("newcandidate@test.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(99L);
            return u;
        });

        User user = authService.register(new RegisterRequest("newcandidate@test.com", "pass12345", "Trần Bình", "0909998888", UserRole.CANDIDATE));
        assertNotNull(user);
        assertEquals("newcandidate@test.com", user.getEmail());
        assertEquals(UserRole.CANDIDATE, user.getRole());
    }

    @Test
    void shouldLoginSuccessfullyWithValidCredentials() {
        User existing = new User("user@test.com", "encodedPassword", "User Test", UserRole.RECRUITER);
        existing.setId(5L);
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(existing));
        when(passwordEncoder.matches("pass12345", "encodedPassword")).thenReturn(true);

        AuthResponse res = authService.login(new LoginRequest("user@test.com", "pass12345"));
        assertNotNull(res);
        assertEquals(5L, res.userId());
        assertEquals(UserRole.RECRUITER, res.role());
    }
}
