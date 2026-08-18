package com.project.recruitment.service;

import com.project.recruitment.domain.User;
import com.project.recruitment.domain.UserRole;
import com.project.recruitment.dto.AuthResponse;
import com.project.recruitment.dto.LoginRequest;
import com.project.recruitment.dto.RegisterRequest;
import com.project.recruitment.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        initDefaultAccounts();
    }

    private void initDefaultAccounts() {
        if (userRepository.findByEmail("candidate@talenthub.vn").isEmpty()) {
            User candidate = new User("candidate@talenthub.vn", passwordEncoder.encode("password123"), "Nguyễn Văn An", UserRole.CANDIDATE);
            candidate.setPhoneNumber("0901234567");
            userRepository.save(candidate);
        }
        if (userRepository.findByEmail("recruiter@talenthub.vn").isEmpty()) {
            User recruiter = new User("recruiter@talenthub.vn", passwordEncoder.encode("password123"), "Trần Thị Mai (Recruiter)", UserRole.RECRUITER);
            recruiter.setPhoneNumber("0912345678");
            userRepository.save(recruiter);
        }
        if (userRepository.findByEmail("moderator@talenthub.vn").isEmpty()) {
            User moderator = new User("moderator@talenthub.vn", passwordEncoder.encode("password123"), "Lê Hoàng Long (Moderator)", UserRole.MODERATOR);
            moderator.setPhoneNumber("0923456789");
            userRepository.save(moderator);
        }
        if (userRepository.findByEmail("admin@talenthub.vn").isEmpty()) {
            User admin = new User("admin@talenthub.vn", passwordEncoder.encode("password123"), "Phạm Minh Đức (Admin)", UserRole.ADMIN);
            admin.setPhoneNumber("0934567890");
            userRepository.save(admin);
        }
    }

    public User register(RegisterRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Registration data is required");
        }
        if (request.email() == null || request.email().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (userRepository.findByEmail(request.email().trim().toLowerCase()).isPresent()) {
            throw new IllegalStateException("Email is already registered");
        }

        User user = new User(
            request.email().trim().toLowerCase(),
            passwordEncoder.encode(request.password()),
            request.fullName().trim(),
            request.role() != null ? request.role() : UserRole.CANDIDATE
        );
        if (request.phoneNumber() != null) {
            user.setPhoneNumber(request.phoneNumber().trim());
        }
        return userRepository.save(user);
    }

    public AuthResponse login(LoginRequest request) {
        if (request == null || request.email() == null || request.password() == null) {
            throw new IllegalArgumentException("Email and password are required");
        }
        User user = userRepository.findByEmail(request.email().trim().toLowerCase())
            .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!user.isEnabled()) {
            throw new IllegalStateException("Account is suspended or deactivated. Please contact admin.");
        }

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = "mock-jwt-token-" + user.getId() + "-" + user.getRole().name();
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole());
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public User updateUserStatus(Long userId, boolean enabled) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        user.setEnabled(enabled);
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public User updateUserRole(Long userId, UserRole role) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        user.setRole(role);
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }
}
