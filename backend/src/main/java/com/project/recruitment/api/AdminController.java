package com.project.recruitment.api;

import com.project.recruitment.domain.AuditLog;
import com.project.recruitment.domain.Company;
import com.project.recruitment.domain.User;
import com.project.recruitment.dto.ApiResponse;
import com.project.recruitment.dto.UserRoleUpdateRequest;
import com.project.recruitment.dto.UserStatusUpdateRequest;
import com.project.recruitment.service.AuditService;
import com.project.recruitment.service.AuthService;
import com.project.recruitment.service.CompanyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    private final AuthService authService;
    private final CompanyService companyService;
    private final AuditService auditService;

    public AdminController(AuthService authService, CompanyService companyService, AuditService auditService) {
        this.authService = authService;
        this.companyService = companyService;
        this.auditService = auditService;
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> listUsers() {
        List<User> users = authService.findAllUsers();
        return ResponseEntity.ok(ApiResponse.ok(users));
    }

    @PatchMapping("/users/{userId}/status")
    public ResponseEntity<ApiResponse<User>> updateUserStatus(
        @PathVariable Long userId,
        @RequestHeader(value = "X-User-Id", required = false, defaultValue = "4") Long adminUserId,
        @RequestBody UserStatusUpdateRequest request
    ) {
        User user = authService.updateUserStatus(userId, request.enabled());
        auditService.logAction(
            adminUserId,
            "Admin",
            "USER_STATUS_CHANGE",
            "USER",
            userId,
            "User " + user.getEmail() + " status set to enabled=" + request.enabled()
        );
        return ResponseEntity.ok(ApiResponse.ok("User status updated", user));
    }

    @PatchMapping("/users/{userId}/role")
    public ResponseEntity<ApiResponse<User>> updateUserRole(
        @PathVariable Long userId,
        @RequestHeader(value = "X-User-Id", required = false, defaultValue = "4") Long adminUserId,
        @Valid @RequestBody UserRoleUpdateRequest request
    ) {
        User user = authService.updateUserRole(userId, request.role());
        auditService.logAction(
            adminUserId,
            "Admin",
            "USER_ROLE_CHANGE",
            "USER",
            userId,
            "User " + user.getEmail() + " role updated to " + request.role()
        );
        return ResponseEntity.ok(ApiResponse.ok("User role updated", user));
    }

    @GetMapping("/companies")
    public ResponseEntity<ApiResponse<List<Company>>> listCompanies() {
        List<Company> companies = companyService.getAllCompanies();
        return ResponseEntity.ok(ApiResponse.ok(companies));
    }

    @PatchMapping("/companies/{companyId}/verify")
    public ResponseEntity<ApiResponse<Company>> verifyCompany(
        @PathVariable Long companyId,
        @RequestHeader(value = "X-User-Id", required = false, defaultValue = "4") Long adminUserId,
        @RequestParam(defaultValue = "true") boolean verified
    ) {
        Company company = companyService.setCompanyVerification(companyId, verified);
        auditService.logAction(
            adminUserId,
            "Admin",
            "COMPANY_VERIFICATION",
            "COMPANY",
            companyId,
            "Company " + (company != null ? company.getName() : companyId) + " verified=" + verified
        );
        return ResponseEntity.ok(ApiResponse.ok("Company verification updated", company));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getAuditLogs() {
        List<AuditLog> logs = auditService.getAllAuditLogs();
        return ResponseEntity.ok(ApiResponse.ok(logs));
    }
}
