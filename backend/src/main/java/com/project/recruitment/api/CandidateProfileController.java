package com.project.recruitment.api;

import com.project.recruitment.domain.CandidateProfile;
import com.project.recruitment.domain.JobApplication;
import com.project.recruitment.dto.ApiResponse;
import com.project.recruitment.dto.CandidateProfileRequest;
import com.project.recruitment.dto.JobApplicationRequest;
import com.project.recruitment.service.CandidateProfileService;
import com.project.recruitment.service.JobApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/candidates")
@CrossOrigin(origins = "*")
public class CandidateProfileController {
    private final CandidateProfileService candidateProfileService;
    private final JobApplicationService jobApplicationService;

    public CandidateProfileController(CandidateProfileService candidateProfileService, JobApplicationService jobApplicationService) {
        this.candidateProfileService = candidateProfileService;
        this.jobApplicationService = jobApplicationService;
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<ApiResponse<CandidateProfile>> getProfile(@PathVariable Long userId, @AuthenticationPrincipal com.project.recruitment.domain.User currentUser) {
        ensureOwnUser(currentUser, userId);
        CandidateProfile profile = candidateProfileService.getProfile(currentUser.getId());
        if (profile == null) {
            // Return empty skeleton profile for easy editing
            profile = new CandidateProfile();
            profile.setUserId(currentUser.getId());
        }
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @PutMapping("/profile/{userId}")
    public ResponseEntity<ApiResponse<CandidateProfile>> upsertProfile(
        @PathVariable Long userId,
        @AuthenticationPrincipal com.project.recruitment.domain.User currentUser,
        @Valid @RequestBody CandidateProfileRequest request
    ) {
        ensureOwnUser(currentUser, userId);
        CandidateProfile profile = candidateProfileService.upsertProfile(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", profile));
    }

    @PutMapping("/preferences/{userId}")
    public ResponseEntity<ApiResponse<CandidateProfile>> updatePreferences(
        @PathVariable Long userId,
        @AuthenticationPrincipal com.project.recruitment.domain.User currentUser,
        @RequestBody Map<String, String> body
    ) {
        String preferences = body.getOrDefault("preferences", "{}");
        ensureOwnUser(currentUser, userId);
        CandidateProfile profile = candidateProfileService.updateSavedPreferences(currentUser.getId(), preferences);
        return ResponseEntity.ok(ApiResponse.ok("Preferences saved successfully", profile));
    }

    @GetMapping("/applications/{userId}")
    public ResponseEntity<ApiResponse<List<JobApplication>>> getApplications(@PathVariable Long userId, @AuthenticationPrincipal com.project.recruitment.domain.User currentUser) {
        ensureOwnUser(currentUser, userId);
        List<JobApplication> applications = jobApplicationService.getApplicationsByCandidateUser(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok(applications));
    }

    @PostMapping("/apply/{jobId}")
    public ResponseEntity<ApiResponse<JobApplication>> applyToJob(
        @PathVariable Long jobId,
        @AuthenticationPrincipal com.project.recruitment.domain.User currentUser,
        @RequestBody(required = false) JobApplicationRequest request
    ) {
        JobApplication application = jobApplicationService.apply(currentUser.getId(), jobId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok("Application submitted successfully", application));
    }

    private void ensureOwnUser(com.project.recruitment.domain.User currentUser, Long requestedUserId) {
        if (!currentUser.getId().equals(requestedUserId)) {
            throw new org.springframework.security.access.AccessDeniedException("Cannot access another user's profile");
        }
    }
}
