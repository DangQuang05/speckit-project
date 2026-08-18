package com.project.recruitment.service;

import com.project.recruitment.domain.JobApplication;
import com.project.recruitment.domain.JobApplicationStatus;
import com.project.recruitment.dto.JobApplicationRequest;
import com.project.recruitment.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class JobApplicationServiceTest {
    private JobApplicationService applicationService;

    @BeforeEach
    void setUp() {
        JobService jobService = new JobService();
        CandidateProfileService candidateProfileService = new CandidateProfileService();
        UserRepository userRepository = Mockito.mock(UserRepository.class);
        PasswordEncoder passwordEncoder = Mockito.mock(PasswordEncoder.class);
        AuthService authService = new AuthService(userRepository, passwordEncoder);
        NotificationService notificationService = new NotificationService();

        applicationService = new JobApplicationService(jobService, candidateProfileService, authService, notificationService);
    }

    @Test
    void shouldSubmitApplicationSuccessfully() {
        JobApplication application = applicationService.apply(10L, 2L, new JobApplicationRequest(
            "Tôi rất hào hứng với vị trí Backend Java này.",
            "Java, Spring Boot, Microservices",
            "https://cv.talenthub.vn/mycv.pdf"
        ));

        assertNotNull(application);
        assertEquals(2L, application.getJobId());
        assertEquals(JobApplicationStatus.SUBMITTED, application.getStatus());
        assertEquals(10L, application.getCandidateUserId());
    }

    @Test
    void shouldPreventDuplicateApplicationsForSameJob() {
        applicationService.apply(11L, 2L, new JobApplicationRequest("Apply 1", "Java", "cv.pdf"));

        IllegalStateException ex = assertThrows(IllegalStateException.class, () ->
            applicationService.apply(11L, 2L, new JobApplicationRequest("Apply duplicate", "Java", "cv.pdf"))
        );
        assertTrue(ex.getMessage().contains("already submitted"));
    }

    @Test
    void shouldUpdateApplicationStatus() {
        JobApplication application = applicationService.apply(12L, 3L, new JobApplicationRequest("Apply QA", "Playwright", "cv.pdf"));
        JobApplication updated = applicationService.updateStatus(application.getId(), JobApplicationStatus.INTERVIEW, "Phỏng vấn vòng 1 vào thứ Hai tuần tới.");

        assertNotNull(updated);
        assertEquals(JobApplicationStatus.INTERVIEW, updated.getStatus());
    }
}
