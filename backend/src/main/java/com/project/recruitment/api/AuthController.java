package com.project.recruitment.api;

import com.project.recruitment.domain.User;
import com.project.recruitment.dto.ApiResponse;
import com.project.recruitment.dto.AuthResponse;
import com.project.recruitment.dto.LoginRequest;
import com.project.recruitment.dto.RegisterRequest;
import com.project.recruitment.security.AuthTokenService;
import com.project.recruitment.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    private final AuthService authService;
    private final AuthTokenService tokenService;

    public AuthController(AuthService authService, AuthTokenService tokenService) {
        this.authService = authService;
        this.tokenService = tokenService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.registerAndLogin(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok("User registered successfully", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @GetMapping("/session")
    public ResponseEntity<ApiResponse<AuthResponse>> session(@RequestHeader(value = "Authorization", required = false) String authorization) {
        String token = bearerToken(authorization);
        return tokenService.authenticate(token)
            .map(session -> {
                User user = session.getUser();
                AuthResponse response = new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole(), session.getExpiresAt());
                return ResponseEntity.ok(ApiResponse.ok("Session is valid", response));
            })
            .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Session is invalid or expired")));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader(value = "Authorization", required = false) String authorization) {
        tokenService.revoke(bearerToken(authorization));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> listUsers() {
        List<User> users = authService.findAllUsers();
        return ResponseEntity.ok(ApiResponse.ok(users));
    }

    private String bearerToken(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return null;
        }
        return authorization.substring("Bearer ".length()).trim();
    }
}
