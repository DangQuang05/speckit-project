package com.project.recruitment.service;

import com.project.recruitment.domain.JobPosting;
import com.project.recruitment.domain.JobStatus;
import com.project.recruitment.domain.ModerationCase;
import com.project.recruitment.domain.ModerationStatus;
import com.project.recruitment.domain.SubjectType;
import com.project.recruitment.domain.User;
import com.project.recruitment.dto.ModerationReportRequest;
import com.project.recruitment.dto.ModerationResolutionRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class ModerationService {
    private final Map<Long, ModerationCase> casesById = new ConcurrentHashMap<>();
    private final AtomicLong caseIdCounter = new AtomicLong(1);

    private final JobService jobService;
    private final AuthService authService;
    private final AuditService auditService;
    private final NotificationService notificationService;

    public ModerationService(JobService jobService, AuthService authService,
                             AuditService auditService, NotificationService notificationService) {
        this.jobService = jobService;
        this.authService = authService;
        this.auditService = auditService;
        this.notificationService = notificationService;
        initDefaultCases();
    }

    private void initDefaultCases() {
        ModerationCase sampleCase = new ModerationCase(
            caseIdCounter.getAndIncrement(),
            SubjectType.JOB_POSTING,
            5L,
            "Mobile Flutter Developer (Remote)",
            1L,
            "Nguyễn Văn An",
            "Mức lương và yêu cầu công việc không khớp với mô tả tuyển dụng hoặc có dấu hiệu thiếu rõ ràng."
        );
        casesById.put(sampleCase.getId(), sampleCase);
    }

    public ModerationCase reportContent(Long reporterUserId, ModerationReportRequest request) {
        if (request == null || request.subjectType() == null || request.subjectId() == null || request.reason() == null || request.reason().isBlank()) {
            throw new IllegalArgumentException("Subject type, subject ID and reason are required");
        }

        User reporter = reporterUserId != null ? authService.findById(reporterUserId).orElse(null) : null;
        String reporterName = reporter != null ? reporter.getFullName() : "Người dùng";

        String title = request.subjectTitle();
        if (title == null || title.isBlank()) {
            if (request.subjectType() == SubjectType.JOB_POSTING) {
                JobPosting job = jobService.getJobById(request.subjectId());
                title = job != null ? job.getTitle() : "Tin tuyển dụng #" + request.subjectId();
            } else {
                title = request.subjectType().name() + " #" + request.subjectId();
            }
        }

        ModerationCase mc = new ModerationCase(
            caseIdCounter.getAndIncrement(),
            request.subjectType(),
            request.subjectId(),
            title,
            reporterUserId,
            reporterName,
            request.reason().trim()
        );

        casesById.put(mc.getId(), mc);

        auditService.logAction(
            reporterUserId,
            reporterName,
            "REPORT_CREATED",
            request.subjectType().name(),
            request.subjectId(),
            "Báo cáo vi phạm với lý do: " + request.reason()
        );

        return mc;
    }

    public List<ModerationCase> getCases(ModerationStatus status) {
        return casesById.values().stream()
            .filter(c -> status == null || status.equals(c.getStatus()))
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .toList();
    }

    public ModerationCase resolveCase(Long moderatorUserId, Long caseId, ModerationResolutionRequest request) {
        ModerationCase mc = casesById.get(caseId);
        if (mc == null) {
            throw new IllegalArgumentException("Moderation case not found: " + caseId);
        }
        if (request == null || request.status() == null) {
            throw new IllegalArgumentException("Resolution status is required");
        }

        User moderator = moderatorUserId != null ? authService.findById(moderatorUserId).orElse(null) : null;
        String moderatorName = moderator != null ? moderator.getFullName() : "Moderator";

        mc.setModeratorUserId(moderatorUserId);
        mc.setStatus(request.status());
        mc.setResolution(request.resolution());
        mc.setResolvedAt(LocalDateTime.now());

        // If rejected / flagged content violates policy, take action on the subject
        if (request.status() == ModerationStatus.REJECTED || request.status() == ModerationStatus.RESOLVED) {
            if (mc.getSubjectType() == SubjectType.JOB_POSTING) {
                JobPosting job = jobService.getJobById(mc.getSubjectId());
                if (job != null && request.status() == ModerationStatus.REJECTED) {
                    jobService.updateStatus(job.getId(), JobStatus.REJECTED);
                    if (job.getRecruiterId() != null) {
                        notificationService.sendNotification(
                            job.getRecruiterId(),
                            "Tin tuyển dụng bị từ chối / gỡ bỏ",
                            "Tin tuyển dụng '" + job.getTitle() + "' đã bị kiểm duyệt gỡ bỏ do vi phạm chính sách: " +
                                (request.resolution() != null ? request.resolution() : mc.getReason()),
                            "MODERATION"
                        );
                    }
                }
            }
        }

        // Notify reporter if exists
        if (mc.getReporterUserId() != null) {
            notificationService.sendNotification(
                mc.getReporterUserId(),
                "Báo cáo của bạn đã được xử lý",
                "Nội dung báo cáo '" + mc.getSubjectTitle() + "' đã được ban kiểm duyệt xem xét và xử lý.",
                "MODERATION"
            );
        }

        auditService.logAction(
            moderatorUserId,
            moderatorName,
            "CASE_RESOLVED",
            mc.getSubjectType().name(),
            mc.getSubjectId(),
            "Kết quả xử lý: " + request.status() + " | Ghi chú: " + request.resolution()
        );

        return mc;
    }
}
