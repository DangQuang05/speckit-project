package com.project.recruitment.service;

import com.project.recruitment.domain.JobStatus;
import com.project.recruitment.domain.ModerationCase;
import com.project.recruitment.domain.ModerationStatus;
import com.project.recruitment.domain.SubjectType;
import com.project.recruitment.dto.ModerationReportRequest;
import com.project.recruitment.dto.ModerationResolutionRequest;
import com.project.recruitment.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ModerationServiceTest {
    private ModerationService moderationService;
    private JobService jobService;

    @BeforeEach
    void setUp() {
        jobService = new JobService();
        UserRepository userRepository = Mockito.mock(UserRepository.class);
        PasswordEncoder passwordEncoder = Mockito.mock(PasswordEncoder.class);
        AuthService authService = new AuthService(userRepository, passwordEncoder);
        AuditService auditService = new AuditService();
        NotificationService notificationService = new NotificationService();

        moderationService = new ModerationService(jobService, authService, auditService, notificationService);
    }

    @Test
    void shouldReportSuspiciousContent() {
        ModerationCase mc = moderationService.reportContent(1L, new ModerationReportRequest(
            SubjectType.JOB_POSTING,
            1L,
            "Senior Frontend Engineer",
            "Mô tả yêu cầu không đúng với thực tế"
        ));

        assertNotNull(mc);
        assertEquals(SubjectType.JOB_POSTING, mc.getSubjectType());
        assertEquals(ModerationStatus.OPEN, mc.getStatus());
    }

    @Test
    void shouldRejectViolatingJobAndHideIt() {
        ModerationCase mc = moderationService.reportContent(1L, new ModerationReportRequest(
            SubjectType.JOB_POSTING,
            2L,
            "Backend Java Engineer",
            "Tin giả mạo"
        ));

        ModerationCase resolved = moderationService.resolveCase(3L, mc.getId(), new ModerationResolutionRequest(
            ModerationStatus.REJECTED,
            "Xác nhận tin giả mạo, gỡ bỏ khỏi sàn."
        ));

        assertEquals(ModerationStatus.REJECTED, resolved.getStatus());
        assertEquals(JobStatus.REJECTED, jobService.getJobById(2L).getStatus());
    }
}
