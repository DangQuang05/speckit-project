package com.project.recruitment.service;

import com.project.recruitment.domain.CandidateProfile;
import com.project.recruitment.domain.JobApplication;
import com.project.recruitment.domain.JobApplicationStatus;
import com.project.recruitment.domain.JobPosting;
import com.project.recruitment.domain.JobStatus;
import com.project.recruitment.domain.User;
import com.project.recruitment.dto.JobApplicationRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class JobApplicationService {
    private final Map<Long, JobApplication> applicationsById = new ConcurrentHashMap<>();
    private final Map<String, JobApplication> applicationByCandidateAndJob = new ConcurrentHashMap<>();
    private final AtomicLong applicationIdCounter = new AtomicLong(1);

    private final JobService jobService;
    private final CandidateProfileService candidateProfileService;
    private final AuthService authService;
    private final NotificationService notificationService;

    public JobApplicationService(JobService jobService, CandidateProfileService candidateProfileService,
                                 AuthService authService, NotificationService notificationService) {
        this.jobService = jobService;
        this.candidateProfileService = candidateProfileService;
        this.authService = authService;
        this.notificationService = notificationService;
        initDefaultApplications();
    }

    private void initDefaultApplications() {
        JobApplication app1 = new JobApplication(
            applicationIdCounter.getAndIncrement(),
            1L,
            1L,
            "Nguyễn Văn An",
            "candidate@talenthub.vn",
            1L,
            "Senior Frontend Engineer (React/TypeScript)",
            "Nexora Labs Vietnam",
            "Tôi có hơn 5 năm kinh nghiệm làm việc với React, TypeScript và xây dựng UI phức tạp, rất hào hứng với vị trí này.",
            "React, TypeScript, CSS Architecture",
            "https://cv.talenthub.vn/nguyen-van-an-cv.pdf",
            JobApplicationStatus.SUBMITTED
        );
        applicationsById.put(app1.getId(), app1);
        applicationByCandidateAndJob.put("1-1", app1);
    }

    public JobApplication apply(Long candidateUserId, Long jobId, JobApplicationRequest request) {
        if (candidateUserId == null || jobId == null) {
            throw new IllegalArgumentException("Candidate user ID and job ID are required");
        }
        JobPosting job = jobService.getJobById(jobId);
        if (job == null) {
            throw new IllegalArgumentException("Job posting not found: " + jobId);
        }
        if (job.getStatus() != JobStatus.ACTIVE) {
            throw new IllegalStateException("Job posting is not open for applications");
        }

        String deduplicationKey = candidateUserId + "-" + jobId;
        if (applicationByCandidateAndJob.containsKey(deduplicationKey)) {
            throw new IllegalStateException("You have already submitted an application for this role.");
        }

        CandidateProfile profile = candidateProfileService.getProfile(candidateUserId);
        User user = authService.findById(candidateUserId).orElse(null);
        String candidateName = user != null ? user.getFullName() : "Ứng viên";
        String candidateEmail = user != null ? user.getEmail() : "";
        Long candidateProfileId = profile != null ? profile.getId() : candidateUserId;
        String cvUrl = request != null && request.cvUrl() != null && !request.cvUrl().isBlank()
            ? request.cvUrl()
            : (profile != null ? profile.getCvUrl() : "https://cv.talenthub.vn/uploaded-cv.pdf");

        String coverLetter = request != null ? request.coverLetter() : "";
        String skillsSummary = request != null ? request.skillsSummary() : (profile != null ? String.join(", ", profile.getSkills()) : "");

        JobApplication application = new JobApplication(
            applicationIdCounter.getAndIncrement(),
            candidateProfileId,
            candidateUserId,
            candidateName,
            candidateEmail,
            jobId,
            job.getTitle(),
            job.getCompanyName(),
            coverLetter,
            skillsSummary,
            cvUrl,
            JobApplicationStatus.SUBMITTED
        );

        applicationsById.put(application.getId(), application);
        applicationByCandidateAndJob.put(deduplicationKey, application);

        // Notify Candidate
        notificationService.sendNotification(
            candidateUserId,
            "Ứng tuyển thành công",
            "Hồ sơ của bạn cho vị trí '" + job.getTitle() + "' tại " + job.getCompanyName() + " đã được gửi thành công.",
            "APPLICATION"
        );

        // Notify Recruiter
        if (job.getRecruiterId() != null) {
            notificationService.sendNotification(
                job.getRecruiterId(),
                "Ứng viên mới ứng tuyển",
                candidateName + " vừa nộp hồ sơ ứng tuyển vị trí '" + job.getTitle() + "'.",
                "APPLICATION"
            );
        }

        return application;
    }

    public JobApplication getById(Long applicationId) {
        return applicationsById.get(applicationId);
    }

    public List<JobApplication> getApplicationsByCandidateUser(Long candidateUserId) {
        if (candidateUserId == null) return List.of();
        return applicationsById.values().stream()
            .filter(app -> candidateUserId.equals(app.getCandidateUserId()))
            .sorted((a, b) -> b.getSubmittedAt().compareTo(a.getSubmittedAt()))
            .toList();
    }

    public List<JobApplication> getApplicationsByJobId(Long jobId) {
        if (jobId == null) return List.of();
        return applicationsById.values().stream()
            .filter(app -> jobId.equals(app.getJobId()))
            .sorted((a, b) -> b.getSubmittedAt().compareTo(a.getSubmittedAt()))
            .toList();
    }

    public List<JobApplication> getApplicationsForRecruiter(Long recruiterId) {
        List<JobPosting> recruiterJobs = jobService.getJobsByRecruiter(recruiterId);
        List<Long> jobIds = recruiterJobs.stream().map(JobPosting::getId).toList();
        return applicationsById.values().stream()
            .filter(app -> jobIds.contains(app.getJobId()))
            .sorted((a, b) -> b.getSubmittedAt().compareTo(a.getSubmittedAt()))
            .toList();
    }

    public JobApplication updateStatus(Long applicationId, JobApplicationStatus newStatus, String feedback) {
        JobApplication application = applicationsById.get(applicationId);
        if (application == null) {
            throw new IllegalArgumentException("Job application not found: " + applicationId);
        }
        application.setStatus(newStatus);
        application.setLastUpdatedAt(LocalDateTime.now());

        // Notify Candidate about stage update
        String statusLabel = switch (newStatus) {
            case REVIEWED -> "Đã xem hồ sơ";
            case INTERVIEW -> "Mời phỏng vấn";
            case OFFER -> "Gửi đề nghị tuyển dụng (Offer)";
            case REJECTED -> "Chưa phù hợp";
            default -> newStatus.name();
        };

        String extra = feedback != null && !feedback.isBlank() ? " Lời nhắn: " + feedback : "";
        notificationService.sendNotification(
            application.getCandidateUserId(),
            "Cập nhật trạng thái hồ sơ",
            "Hồ sơ ứng tuyển '" + application.getJobTitle() + "' tại " + application.getCompanyName() +
                " đã chuyển sang trạng thái: " + statusLabel + "." + extra,
            "STATUS_UPDATE"
        );

        return application;
    }
}
