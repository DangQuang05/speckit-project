package com.project.recruitment.api;

import com.project.recruitment.domain.EmploymentType;
import com.project.recruitment.domain.ExperienceLevel;
import com.project.recruitment.domain.JobPosting;
import com.project.recruitment.domain.JobStatus;
import com.project.recruitment.dto.ApiResponse;
import com.project.recruitment.dto.JobPostingRequest;
import com.project.recruitment.service.JobService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.project.recruitment.domain.User;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/jobs")
@CrossOrigin(origins = "*")
public class JobController {
    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<JobPosting>>> listJobs(
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) String city,
        @RequestParam(required = false) String skill,
        @RequestParam(required = false) EmploymentType employmentType,
        @RequestParam(required = false) ExperienceLevel experienceLevel,
        @RequestParam(required = false) Long companyId,
        @RequestParam(required = false) Boolean activeOnly
    ) {
        List<JobPosting> results = jobService.searchJobs(keyword, city, skill, employmentType, experienceLevel, companyId, activeOnly);
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobPosting>> getJob(@PathVariable Long id) {
        JobPosting job = jobService.getJobById(id);
        if (job == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Job not found"));
        }
        return ResponseEntity.ok(ApiResponse.ok(job));
    }

    @PostMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<JobPosting>> createJob(
        @AuthenticationPrincipal User recruiter,
        @Valid @RequestBody JobPostingRequest request
    ) {
        JobPosting job = jobService.createJob(recruiter.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Job created successfully", job));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<JobPosting>> updateJob(
        @PathVariable Long id,
        @Valid @RequestBody JobPostingRequest request
    ) {
        JobPosting job = jobService.updateJob(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Job updated successfully", job));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<JobPosting>> updateStatus(
        @PathVariable Long id,
        @RequestParam JobStatus status
    ) {
        JobPosting job = jobService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Job status updated", job));
    }
}
