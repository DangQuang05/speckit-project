package com.project.recruitment.service;

import com.project.recruitment.domain.EmploymentType;
import com.project.recruitment.domain.ExperienceLevel;
import com.project.recruitment.domain.JobPosting;
import com.project.recruitment.domain.JobStatus;
import com.project.recruitment.dto.JobPostingRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class JobService {
    private final Map<Long, JobPosting> jobsById = new ConcurrentHashMap<>();
    private final AtomicLong jobIdCounter = new AtomicLong(1);

    public JobService() {
        initDefaultJobs();
    }

    private void initDefaultJobs() {
        addJob(new JobPosting(
            jobIdCounter.getAndIncrement(),
            1L,
            "Nexora Labs Vietnam",
            2L,
            "Senior Frontend Engineer (React/TypeScript)",
            "Hồ Chí Minh",
            EmploymentType.FULL_TIME,
            ExperienceLevel.SENIOR,
            30000000,
            45000000,
            "30 - 45 triệu VND",
            "Chịu trách nhiệm kiến trúc và phát triển hệ thống web quy mô lớn, thiết kế Design System cho sản phẩm SaaS.",
            List.of("Tối thiểu 4 năm kinh nghiệm với React & TypeScript", "Thành thạo State Management (Zustand/Redux)", "Kinh nghiệm tối ưu Web Vitals"),
            List.of("React", "TypeScript", "TailwindCSS", "REST API", "Vite"),
            JobStatus.ACTIVE
        ));

        addJob(new JobPosting(
            jobIdCounter.getAndIncrement(),
            2L,
            "Việt Digital Tech",
            2L,
            "Backend Java Engineer (Spring Boot / Microservices)",
            "Hà Nội",
            EmploymentType.FULL_TIME,
            ExperienceLevel.MID,
            25000000,
            38000000,
            "25 - 38 triệu VND",
            "Xây dựng hạ tầng xử lý giao dịch thanh toán tốc độ cao, thiết kế API phân tán và tối ưu truy vấn PostgreSQL.",
            List.of("Tối thiểu 3 năm kinh nghiệm với Java 17/21 và Spring Boot", "Hiểu sâu về JPA/Hibernate và transaction management", "Kinh nghiệm với Kafka và Redis là điểm cộng"),
            List.of("Java", "Spring Boot", "PostgreSQL", "Kafka", "Docker"),
            JobStatus.ACTIVE
        ));

        addJob(new JobPosting(
            jobIdCounter.getAndIncrement(),
            3L,
            "Kite Solutions Đà Nẵng",
            2L,
            "QA Automation Engineer (Playwright / Java)",
            "Đà Nẵng",
            EmploymentType.FULL_TIME,
            ExperienceLevel.MID,
            20000000,
            30000000,
            "20 - 30 triệu VND",
            "Xây dựng automation test framework, thực hiện kiểm thử tự động API và UI cho các ứng dụng web phức tạp.",
            List.of("Ít nhất 2 năm kinh nghiệm Automation QA", "Thành thạo Playwright hoặc Selenium / Cypress", "Hiểu biết về CI/CD pipeline"),
            List.of("Playwright", "Automation Testing", "Java", "CI/CD", "Postman"),
            JobStatus.ACTIVE
        ));

        addJob(new JobPosting(
            jobIdCounter.getAndIncrement(),
            1L,
            "Nexora Labs Vietnam",
            2L,
            "DevOps / Cloud Engineer (AWS / Kubernetes)",
            "Hồ Chí Minh",
            EmploymentType.FULL_TIME,
            ExperienceLevel.SENIOR,
            35000000,
            55000000,
            "35 - 55 triệu VND",
            "Quản trị hạ tầng đám mây AWS, triển khai Kubernetes cluster và xây dựng CI/CD tự động hóa cao.",
            List.of("3+ năm kinh nghiệm DevOps & Cloud", "Kinh nghiệm triển khai EKS, Terraform, Helm", "Thành thạo giám sát với Prometheus & Grafana"),
            List.of("DevOps", "AWS", "Kubernetes", "Docker", "Terraform", "CI/CD"),
            JobStatus.ACTIVE
        ));

        addJob(new JobPosting(
            jobIdCounter.getAndIncrement(),
            2L,
            "Việt Digital Tech",
            2L,
            "Mobile Flutter Developer",
            "Remote",
            EmploymentType.FULL_TIME,
            ExperienceLevel.JUNIOR,
            15000000,
            22000000,
            "15 - 22 triệu VND",
            "Phát triển ứng dụng mobile đa nền tảng iOS & Android với Flutter cho nền tảng fintech tiêu dùng.",
            List.of("1-2 năm kinh nghiệm Flutter/Dart", "Nắm vững BLoC hoặc Riverpod", "Có sản phẩm đã publish lên App Store / Google Play là lợi thế"),
            List.of("Flutter", "Dart", "Mobile App", "REST API"),
            JobStatus.ACTIVE
        ));
    }

    private void addJob(JobPosting job) {
        jobsById.put(job.getId(), job);
    }

    public List<JobPosting> searchJobs(String keyword, String city, String skill,
                                       EmploymentType employmentType, ExperienceLevel experienceLevel,
                                       Long companyId, Boolean activeOnly) {
        String normalizedKeyword = keyword == null ? "" : keyword.trim().toLowerCase(Locale.ROOT);
        String normalizedCity = city == null ? "" : city.trim().toLowerCase(Locale.ROOT);
        String normalizedSkill = skill == null ? "" : skill.trim().toLowerCase(Locale.ROOT);

        return jobsById.values().stream()
            .filter(job -> {
                if (Boolean.FALSE.equals(activeOnly)) return true;
                return job.getStatus() == JobStatus.ACTIVE;
            })
            .filter(job -> companyId == null || companyId.equals(job.getCompanyId()))
            .filter(job -> employmentType == null || employmentType.equals(job.getEmploymentType()))
            .filter(job -> experienceLevel == null || experienceLevel.equals(job.getExperienceLevel()))
            .filter(job -> normalizedCity.isBlank() || (job.getLocation() != null && job.getLocation().toLowerCase(Locale.ROOT).contains(normalizedCity)))
            .filter(job -> normalizedSkill.isBlank() || job.getSkillsRequired().stream().anyMatch(s -> s.toLowerCase(Locale.ROOT).contains(normalizedSkill)))
            .filter(job -> normalizedKeyword.isBlank() || matchesKeyword(job, normalizedKeyword))
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .toList();
    }

    public JobPosting getJobById(Long id) {
        return jobsById.get(id);
    }

    public List<JobPosting> getJobsByRecruiter(Long recruiterId) {
        if (recruiterId == null) return List.of();
        return jobsById.values().stream()
            .filter(j -> recruiterId.equals(j.getRecruiterId()))
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .toList();
    }

    public JobPosting createJob(Long recruiterId, JobPostingRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Job details are required");
        }
        if (request.title() == null || request.title().isBlank()) {
            throw new IllegalArgumentException("Job title is required");
        }
        if (request.location() == null || request.location().isBlank()) {
            throw new IllegalArgumentException("Location is required");
        }
        if (request.description() == null || request.description().isBlank()) {
            throw new IllegalArgumentException("Job description is required");
        }
        if (request.skillsRequired() == null || request.skillsRequired().isEmpty()) {
            throw new IllegalArgumentException("At least one required skill must be specified");
        }

        String salaryFormatted = request.salaryText();
        if ((salaryFormatted == null || salaryFormatted.isBlank()) && request.salaryMin() != null && request.salaryMax() != null) {
            salaryFormatted = String.format("%d - %d triệu VND", request.salaryMin() / 1000000, request.salaryMax() / 1000000);
        }

        JobPosting job = new JobPosting(
            jobIdCounter.getAndIncrement(),
            request.companyId() != null ? request.companyId() : 1L,
            request.companyName() != null && !request.companyName().isBlank() ? request.companyName().trim() : "Tech Company",
            recruiterId != null ? recruiterId : 2L,
            request.title().trim(),
            request.location().trim(),
            request.employmentType() != null ? request.employmentType() : EmploymentType.FULL_TIME,
            request.experienceLevel() != null ? request.experienceLevel() : ExperienceLevel.MID,
            request.salaryMin(),
            request.salaryMax(),
            salaryFormatted != null && !salaryFormatted.isBlank() ? salaryFormatted : "Thỏa thuận",
            request.description().trim(),
            request.requirements() != null ? request.requirements() : List.of(),
            request.skillsRequired(),
            request.status() != null ? request.status() : JobStatus.ACTIVE
        );

        jobsById.put(job.getId(), job);
        return job;
    }

    public JobPosting updateJob(Long id, JobPostingRequest request) {
        JobPosting job = jobsById.get(id);
        if (job == null) {
            throw new IllegalArgumentException("Job posting not found: " + id);
        }
        if (request.title() != null && !request.title().isBlank()) {
            job.setTitle(request.title().trim());
        }
        if (request.location() != null && !request.location().isBlank()) {
            job.setLocation(request.location().trim());
        }
        if (request.employmentType() != null) {
            job.setEmploymentType(request.employmentType());
        }
        if (request.experienceLevel() != null) {
            job.setExperienceLevel(request.experienceLevel());
        }
        if (request.salaryMin() != null) {
            job.setSalaryMin(request.salaryMin());
        }
        if (request.salaryMax() != null) {
            job.setSalaryMax(request.salaryMax());
        }
        if (request.salaryText() != null) {
            job.setSalaryText(request.salaryText());
        }
        if (request.description() != null && !request.description().isBlank()) {
            job.setDescription(request.description().trim());
        }
        if (request.requirements() != null) {
            job.setRequirements(request.requirements());
        }
        if (request.skillsRequired() != null && !request.skillsRequired().isEmpty()) {
            job.setSkillsRequired(request.skillsRequired());
        }
        if (request.status() != null) {
            job.setStatus(request.status());
        }
        job.setUpdatedAt(LocalDateTime.now());
        return job;
    }

    public JobPosting updateStatus(Long id, JobStatus status) {
        JobPosting job = jobsById.get(id);
        if (job == null) {
            throw new IllegalArgumentException("Job posting not found: " + id);
        }
        job.setStatus(status);
        job.setUpdatedAt(LocalDateTime.now());
        return job;
    }

    private boolean matchesKeyword(JobPosting job, String keyword) {
        String haystack = (job.getTitle() == null ? "" : job.getTitle()) + " " +
            (job.getCompanyName() == null ? "" : job.getCompanyName()) + " " +
            (job.getDescription() == null ? "" : job.getDescription()) + " " +
            String.join(" ", job.getSkillsRequired());
        return haystack.toLowerCase(Locale.ROOT).contains(keyword);
    }
}
