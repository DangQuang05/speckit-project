package com.project.recruitment.security;

import com.project.recruitment.domain.User;
import com.project.recruitment.domain.UserSession;
import com.project.recruitment.repository.UserSessionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@Service
public class AuthTokenService {
    private static final int TOKEN_BYTES = 32;
    private final UserSessionRepository sessionRepository;
    private final SecureRandom secureRandom = new SecureRandom();
    private final Clock clock;
    private final long sessionHours;

    @Autowired
    public AuthTokenService(
        UserSessionRepository sessionRepository,
        @Value("${auth.session-hours:24}") long sessionHours
    ) {
        this(sessionRepository, sessionHours, Clock.systemUTC());
    }

    AuthTokenService(UserSessionRepository sessionRepository, long sessionHours, Clock clock) {
        this.sessionRepository = sessionRepository;
        this.sessionHours = sessionHours;
        this.clock = clock;
    }

    @Transactional
    public IssuedSession issue(User user) {
        String token = randomToken();
        LocalDateTime now = LocalDateTime.now(clock);
        UserSession session = new UserSession(hash(token), user, now, now.plusHours(sessionHours));
        sessionRepository.save(session);
        return new IssuedSession(token, session.getExpiresAt());
    }

    @Transactional
    public Optional<UserSession> authenticate(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }
        Optional<UserSession> found = sessionRepository.findByTokenHash(hash(token));
        if (found.isEmpty()) {
            return Optional.empty();
        }
        UserSession session = found.get();
        LocalDateTime now = LocalDateTime.now(clock);
        if (session.isRevoked() || !session.getExpiresAt().isAfter(now) || !session.getUser().isEnabled()) {
            return Optional.empty();
        }
        session.setLastActivityAt(now);
        session.setExpiresAt(now.plusHours(sessionHours));
        return Optional.of(sessionRepository.save(session));
    }

    @Transactional
    public void revoke(String token) {
        if (token == null || token.isBlank()) {
            return;
        }
        sessionRepository.findByTokenHash(hash(token)).ifPresent(session -> {
            session.setRevoked(true);
            sessionRepository.save(session);
        });
    }

    private String randomToken() {
        byte[] bytes = new byte[TOKEN_BYTES];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hash(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                .digest(token.getBytes(StandardCharsets.UTF_8));
            StringBuilder result = new StringBuilder(digest.length * 2);
            for (byte value : digest) {
                result.append(String.format("%02x", value));
            }
            return result.toString();
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("Session hashing is unavailable", exception);
        }
    }

    public record IssuedSession(String token, LocalDateTime expiresAt) {
    }
}
