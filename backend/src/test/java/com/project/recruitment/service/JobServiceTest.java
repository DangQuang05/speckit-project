package com.project.recruitment.service;

import com.project.recruitment.domain.EmploymentType;
import com.project.recruitment.domain.ExperienceLevel;
import com.project.recruitment.domain.JobPosting;
import com.project.recruitment.domain.JobStatus;
import com.project.recruitment.dto.JobPostingRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class JobServiceTest {
    private JobService jobService;

    @BeforeEach
    void setUp() {
        jobService = new JobService();
    }

    @Test
    void shouldSearchAndFilterJobsByCityAndSkill() {
        List<JobPosting> results = jobService.searchJobs("Java", "Hà Nội", null, null, null, null, true);
        assertNotNull(results);
        assertFalse(results.isEmpty());
        assertTrue(results.stream().anyMatch(j -> j.getTitle().contains("Java")));
    }

    @Test
    void shouldCreateNewJobPosting() {
        JobPosting job = jobService.createJob(2L, new JobPostingRequest(
            1L,
            "Nexora Labs",
            "Golang Cloud Engineer",
            "Đà Nẵng",
            EmploymentType.FULL_TIME,
            ExperienceLevel.SENIOR,
            30000000,
            45000000,
            "30 - 45 triệu VND",
            "Xây dựng microservices hiệu năng cao với Golang",
            List.of("3+ năm Golang"),
            List.of("Golang", "gRPC", "Kubernetes"),
            JobStatus.ACTIVE
        ));

        assertNotNull(job);
        assertEquals("Golang Cloud Engineer", job.getTitle());
        assertEquals("Đà Nẵng", job.getLocation());
        assertEquals(JobStatus.ACTIVE, job.getStatus());
    }

    @Test
    void shouldUpdateJobStatus() {
        JobPosting job = jobService.updateStatus(1L, JobStatus.CLOSED);
        assertNotNull(job);
        assertEquals(JobStatus.CLOSED, job.getStatus());
    }
}
