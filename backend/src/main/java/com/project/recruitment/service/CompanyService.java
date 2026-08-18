package com.project.recruitment.service;

import com.project.recruitment.domain.Company;
import com.project.recruitment.domain.RecruiterProfile;
import com.project.recruitment.dto.CompanyRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class CompanyService {
    private final Map<Long, Company> companiesById = new ConcurrentHashMap<>();
    private final Map<Long, RecruiterProfile> recruiterProfilesByUserId = new ConcurrentHashMap<>();
    private final AtomicLong companyIdCounter = new AtomicLong(1);
    private final AtomicLong recruiterProfileIdCounter = new AtomicLong(1);

    public CompanyService() {
        initDefaultCompanies();
    }

    private void initDefaultCompanies() {
        Company nexora = new Company(
            companyIdCounter.getAndIncrement(),
            "Nexora Labs Vietnam",
            "https://nexoralabs.vn",
            "Hồ Chí Minh (Quận 1)",
            "Software & Cloud Solutions",
            "Công ty công nghệ hàng đầu chuyên về hệ thống phân tán và giải pháp SaaS hiện đại cho thị trường APAC.",
            true
        );
        Company vietDigital = new Company(
            companyIdCounter.getAndIncrement(),
            "Việt Digital Tech",
            "https://vietdigital.tech",
            "Hà Nội (Cầu Giấy)",
            "Fintech & Banking",
            "Hệ sinh thái công nghệ tài chính phục vụ hàng triệu người dùng tại Việt Nam.",
            true
        );
        Company kite = new Company(
            companyIdCounter.getAndIncrement(),
            "Kite Solutions Đà Nẵng",
            "https://kitedanang.io",
            "Đà Nẵng (Hải Châu)",
            "AI & Product Engineering",
            "Tập đoàn đổi mới phát triển các ứng dụng thông minh cho khách hàng toàn cầu.",
            true
        );
        companiesById.put(nexora.getId(), nexora);
        companiesById.put(vietDigital.getId(), vietDigital);
        companiesById.put(kite.getId(), kite);

        // Associate default recruiter (userId 2) with Nexora Labs
        RecruiterProfile defaultRecruiter = new RecruiterProfile(
            recruiterProfileIdCounter.getAndIncrement(),
            2L,
            nexora.getId(),
            "Talent Acquisition Lead",
            true
        );
        recruiterProfilesByUserId.put(2L, defaultRecruiter);
    }

    public Company createCompany(Long userId, CompanyRequest request) {
        if (request == null || request.name() == null || request.name().isBlank()) {
            throw new IllegalArgumentException("Company name is required");
        }
        Company company = new Company(
            companyIdCounter.getAndIncrement(),
            request.name().trim(),
            request.website(),
            request.location() != null ? request.location().trim() : "Việt Nam",
            request.industry(),
            request.description(),
            false // Initially unverified until admin review
        );
        companiesById.put(company.getId(), company);

        if (userId != null) {
            RecruiterProfile profile = recruiterProfilesByUserId.get(userId);
            if (profile == null) {
                profile = new RecruiterProfile(
                    recruiterProfileIdCounter.getAndIncrement(),
                    userId,
                    company.getId(),
                    "Hiring Manager",
                    false
                );
                recruiterProfilesByUserId.put(userId, profile);
            } else {
                profile.setCompanyId(company.getId());
            }
        }

        return company;
    }

    public Company getCompanyById(Long id) {
        return companiesById.get(id);
    }

    public List<Company> getAllCompanies() {
        return new ArrayList<>(companiesById.values());
    }

    public RecruiterProfile getRecruiterProfile(Long userId) {
        return recruiterProfilesByUserId.get(userId);
    }

    public RecruiterProfile linkRecruiterToCompany(Long userId, Long companyId, String positionTitle) {
        RecruiterProfile profile = recruiterProfilesByUserId.computeIfAbsent(userId, id -> new RecruiterProfile(
            recruiterProfileIdCounter.getAndIncrement(),
            userId,
            companyId,
            positionTitle != null ? positionTitle : "HR Specialist",
            false
        ));
        profile.setCompanyId(companyId);
        if (positionTitle != null) {
            profile.setPositionTitle(positionTitle);
        }
        return profile;
    }

    public Company setCompanyVerification(Long companyId, boolean verified) {
        Company company = companiesById.get(companyId);
        if (company != null) {
            company.setVerified(verified);
        }
        return company;
    }
}
