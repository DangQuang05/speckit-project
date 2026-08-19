package com.project.recruitment.api;

import com.project.recruitment.domain.JobApplication;
import com.project.recruitment.dto.ApiResponse;
import com.project.recruitment.dto.ApplicationStatusUpdateRequest;
import com.project.recruitment.dto.JobApplicationRequest;
import com.project.recruitment.service.JobApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.project.recruitment.domain.User;

import java.util.List;

@RestController
@RequestMapping("/applications")
@CrossOrigin(origins = "*")
public class JobApplicationController {
    private final JobApplicationService jobApplicationService;

    public JobApplicationController(JobApplicationService jobApplicationService) {
        this.jobApplicationService = jobApplicationService;
    }

    @PostMapping("/jobs/{jobId}")
    public ResponseEntity<ApiResponse<JobApplication>> apply(
        @PathVariable Long jobId,
        @AuthenticationPrincipal User currentUser,
        @RequestBody(required = false) JobApplicationRequest request
    ) {
        JobApplication application = jobApplicationService.apply(currentUser.getId(), jobId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok("Applied successfully", application));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobApplication>> getById(@PathVariable Long id) {
        JobApplication app = jobApplicationService.getById(id);
        if (app == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Application not found"));
        }
        return ResponseEntity.ok(ApiResponse.ok(app));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<JobApplication>> updateStatus(
        @PathVariable Long id,
        @Valid @RequestBody ApplicationStatusUpdateRequest request
    ) {
        JobApplication app = jobApplicationService.updateStatus(id, request.status(), request.feedback());
        return ResponseEntity.ok(ApiResponse.ok("Status updated successfully", app));
    }
}
