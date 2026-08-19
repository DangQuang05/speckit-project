package com.project.recruitment.service;

import com.project.recruitment.domain.User;
import com.project.recruitment.domain.UserRole;
import com.project.recruitment.dto.AuthResponse;
import com.project.recruitment.dto.LoginRequest;
import com.project.recruitment.dto.RegisterRequest;
import com.project.recruitment.repository.UserRepository;
import com.project.recruitment.security.AuthTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class AuthService {
    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final long LOCKOUT_MINUTES = 15;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthTokenService tokenService;

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthTokenService tokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
        initDefaultAccounts();
    }

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this(userRepository, passwordEncoder, null);
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
        if (request.role() == null || (request.role() != UserRole.CANDIDATE && request.role() != UserRole.RECRUITER)) {
            throw new IllegalArgumentException("Self-registration is limited to Candidate and Recruiter roles");
        }
        validatePassword(request.password());

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

    public AuthResponse registerAndLogin(RegisterRequest request) {
        User user = register(request);
        return createSessionResponse(user);
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

        if (user.getLockedUntil() != null && user.getLockedUntil().isAfter(LocalDateTime.now())) {
            throw new IllegalStateException("Account is temporarily locked. Please try again later.");
        }

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            int failedAttempts = user.getFailedLoginAttempts() + 1;
            user.setFailedLoginAttempts(failedAttempts);
            if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
                user.setLockedUntil(LocalDateTime.now().plusMinutes(LOCKOUT_MINUTES));
            }
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
            throw new IllegalArgumentException("Invalid email or password");
        }

        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        return createSessionResponse(user);
    }

    private AuthResponse createSessionResponse(User user) {
        if (tokenService == null) {
            return new AuthResponse("test-token", user.getId(), user.getEmail(), user.getFullName(), user.getRole(), LocalDateTime.now().plus(24, ChronoUnit.HOURS));
        }
        AuthTokenService.IssuedSession session = tokenService.issue(user);
        return new AuthResponse(session.token(), user.getId(), user.getEmail(), user.getFullName(), user.getRole(), session.expiresAt());
    }

    private void validatePassword(String password) {
        if (password == null || password.length() < 8
            || !password.matches(".*[A-Z].*")
            || !password.matches(".*\\d.*")
            || !password.matches(".*[^A-Za-z0-9].*")) {
            throw new IllegalArgumentException("Password must be at least 8 characters and include an uppercase letter, a number, and a special character");
        }
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
