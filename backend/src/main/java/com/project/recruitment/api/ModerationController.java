package com.project.recruitment.api;

import com.project.recruitment.domain.ModerationCase;
import com.project.recruitment.domain.ModerationStatus;
import com.project.recruitment.dto.ApiResponse;
import com.project.recruitment.dto.ModerationReportRequest;
import com.project.recruitment.dto.ModerationResolutionRequest;
import com.project.recruitment.service.ModerationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.project.recruitment.domain.User;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/moderation")
@CrossOrigin(origins = "*")
public class ModerationController {
    private final ModerationService moderationService;

    public ModerationController(ModerationService moderationService) {
        this.moderationService = moderationService;
    }

    @PostMapping("/reports")
    public ResponseEntity<ApiResponse<ModerationCase>> createReport(
        @AuthenticationPrincipal User reporter,
        @Valid @RequestBody ModerationReportRequest request
    ) {
        ModerationCase mc = moderationService.reportContent(reporter.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok("Report submitted for review", mc));
    }

    @GetMapping("/cases")
    public ResponseEntity<ApiResponse<List<ModerationCase>>> listCases(
        @RequestParam(required = false) ModerationStatus status
    ) {
        List<ModerationCase> cases = moderationService.getCases(status);
        return ResponseEntity.ok(ApiResponse.ok(cases));
    }

    @PatchMapping("/cases/{caseId}/resolve")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<ApiResponse<ModerationCase>> resolveCase(
        @PathVariable Long caseId,
        @AuthenticationPrincipal User moderator,
        @Valid @RequestBody ModerationResolutionRequest request
    ) {
        ModerationCase mc = moderationService.resolveCase(moderator.getId(), caseId, request);
        return ResponseEntity.ok(ApiResponse.ok("Case resolved successfully", mc));
    }
}
