package com.project.recruitment.service;

import com.project.recruitment.domain.CandidateProfile;
import com.project.recruitment.dto.CandidateProfileRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class CandidateProfileService {
    private final Map<Long, CandidateProfile> profilesByUserId = new ConcurrentHashMap<>();
    private final AtomicLong profileIdCounter = new AtomicLong(1);

    public CandidateProfileService() {
        initDefaultCandidateProfile();
    }

    private void initDefaultCandidateProfile() {
        CandidateProfile profile = new CandidateProfile(
            1L, // Candidate userId = 1
            "Senior Fullstack Engineer (React / Java Spring)",
            "Kỹ sư phần mềm hơn 5 năm kinh nghiệm xây dựng hệ thống web quy mô lớn, microservices và tối ưu hóa hiệu năng frontend.",
            5,
            "Hồ Chí Minh",
            List.of("Java", "Spring Boot", "React", "TypeScript", "PostgreSQL", "Docker"),
            "https://cv.talenthub.vn/nguyen-van-an-cv.pdf",
            true
        );
        profile.setId(profileIdCounter.getAndIncrement());
        profile.setSavedPreferences("{\"city\":\"Hồ Chí Minh\",\"skills\":[\"Java\",\"React\"],\"employmentType\":\"FULL_TIME\"}");
        profilesByUserId.put(1L, profile);
    }

    public CandidateProfile upsertProfile(Long userId, CandidateProfileRequest request) {
        if (userId == null) {
            throw new IllegalArgumentException("User id is required");
        }
        if (request == null) {
            throw new IllegalArgumentException("Profile data is required");
        }
        if (request.headline() == null || request.headline().isBlank()) {
            throw new IllegalArgumentException("Headline is required");
        }
        if (request.summary() == null || request.summary().isBlank()) {
            throw new IllegalArgumentException("Summary is required");
        }
        if (request.city() == null || request.city().isBlank()) {
            throw new IllegalArgumentException("City is required");
        }
        if (request.skills() == null || request.skills().isEmpty()) {
            throw new IllegalArgumentException("At least one skill is required");
        }

        CandidateProfile profile = profilesByUserId.computeIfAbsent(userId, id -> {
            CandidateProfile p = new CandidateProfile();
            p.setId(profileIdCounter.getAndIncrement());
            p.setUserId(userId);
            return p;
        });

        profile.setHeadline(request.headline().trim());
        profile.setSummary(request.summary().trim());
        profile.setExperienceYears(request.experienceYears() != null ? request.experienceYears() : 0);
        profile.setCity(request.city().trim());
        profile.setSkills(request.skills().stream().filter(item -> item != null && !item.isBlank()).map(String::trim).toList());
        profile.setCvUrl(request.cvUrl() != null && !request.cvUrl().isBlank() ? request.cvUrl().trim() : "https://cv.talenthub.vn/uploaded-cv.pdf");
        profile.setAvailableForWork(request.availableForWork());
        if (request.savedPreferences() != null) {
            profile.setSavedPreferences(request.savedPreferences());
        }
        profile.setUpdatedAt(LocalDateTime.now());

        return profile;
    }

    public CandidateProfile getProfile(Long userId) {
        return profilesByUserId.get(userId);
    }

    public CandidateProfile updateSavedPreferences(Long userId, String preferences) {
        CandidateProfile profile = profilesByUserId.get(userId);
        if (profile == null) {
            profile = new CandidateProfile();
            profile.setId(profileIdCounter.getAndIncrement());
            profile.setUserId(userId);
            profile.setHeadline("Software Engineer");
            profile.setSummary("IT Professional in Vietnam");
            profile.setCity("Hồ Chí Minh");
            profile.setSkills(List.of("Software Development"));
            profilesByUserId.put(userId, profile);
        }
        profile.setSavedPreferences(preferences);
        profile.setUpdatedAt(LocalDateTime.now());
        return profile;
    }
}
