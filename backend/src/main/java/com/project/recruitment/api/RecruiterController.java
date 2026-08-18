package com.project.recruitment.api;

import com.project.recruitment.domain.Company;
import com.project.recruitment.domain.JobApplication;
import com.project.recruitment.domain.JobPosting;
import com.project.recruitment.domain.RecruiterProfile;
import com.project.recruitment.dto.ApiResponse;
import com.project.recruitment.dto.CompanyRequest;
import com.project.recruitment.service.CompanyService;
import com.project.recruitment.service.JobApplicationService;
import com.project.recruitment.service.JobService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recruiters")
@CrossOrigin(origins = "*")
public class RecruiterController {
    private final CompanyService companyService;
    private final JobService jobService;
    private final JobApplicationService jobApplicationService;

    public RecruiterController(CompanyService companyService, JobService jobService, JobApplicationService jobApplicationService) {
        this.companyService = companyService;
        this.jobService = jobService;
        this.jobApplicationService = jobApplicationService;
    }

    @GetMapping("/{recruiterId}/company")
    public ResponseEntity<ApiResponse<Company>> getCompany(@PathVariable Long recruiterId) {
        RecruiterProfile profile = companyService.getRecruiterProfile(recruiterId);
        if (profile == null || profile.getCompanyId() == null) {
            return ResponseEntity.ok(ApiResponse.ok(null));
        }
        Company company = companyService.getCompanyById(profile.getCompanyId());
        return ResponseEntity.ok(ApiResponse.ok(company));
    }

    @PostMapping("/{recruiterId}/company")
    public ResponseEntity<ApiResponse<Company>> createCompany(
        @PathVariable Long recruiterId,
        @Valid @RequestBody CompanyRequest request
    ) {
        Company company = companyService.createCompany(recruiterId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Company created", company));
    }

    @GetMapping("/{recruiterId}/jobs")
    public ResponseEntity<ApiResponse<List<JobPosting>>> getRecruiterJobs(@PathVariable Long recruiterId) {
        List<JobPosting> jobs = jobService.getJobsByRecruiter(recruiterId);
        return ResponseEntity.ok(ApiResponse.ok(jobs));
    }

    @GetMapping("/{recruiterId}/applications")
    public ResponseEntity<ApiResponse<List<JobApplication>>> getRecruiterApplications(@PathVariable Long recruiterId) {
        List<JobApplication> applications = jobApplicationService.getApplicationsForRecruiter(recruiterId);
        return ResponseEntity.ok(ApiResponse.ok(applications));
    }

    @GetMapping("/jobs/{jobId}/applications")
    public ResponseEntity<ApiResponse<List<JobApplication>>> getJobApplications(@PathVariable Long jobId) {
        List<JobApplication> applications = jobApplicationService.getApplicationsByJobId(jobId);
        return ResponseEntity.ok(ApiResponse.ok(applications));
    }
}
