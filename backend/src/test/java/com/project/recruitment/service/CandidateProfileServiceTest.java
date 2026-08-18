package com.project.recruitment.service;

import com.project.recruitment.domain.CandidateProfile;
import com.project.recruitment.dto.CandidateProfileRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class CandidateProfileServiceTest {
    private CandidateProfileService service;

    @BeforeEach
    void setUp() {
        service = new CandidateProfileService();
    }

    @Test
    void shouldCreateOrUpdateCandidateProfile() {
        CandidateProfile profile = service.upsertProfile(10L, new CandidateProfileRequest(
            "Senior Backend Engineer",
            "5 years experience with Java, Spring Boot, Microservices",
            5,
            "Hồ Chí Minh",
            List.of("Java", "Spring Boot", "Docker"),
            "https://cv.talenthub.vn/mycv.pdf",
            true,
            "{\"city\":\"Hồ Chí Minh\"}"
        ));

        assertNotNull(profile);
        assertEquals("Senior Backend Engineer", profile.getHeadline());
        assertEquals("Hồ Chí Minh", profile.getCity());
        assertEquals(3, profile.getSkills().size());
        assertTrue(profile.isAvailableForWork());
    }

    @Test
    void shouldSaveAndRetrievePreferences() {
        service.updateSavedPreferences(10L, "{\"city\":\"Hà Nội\",\"skill\":\"Java\"}");
        CandidateProfile profile = service.getProfile(10L);

        assertNotNull(profile);
        assertTrue(profile.getSavedPreferences().contains("Hà Nội"));
    }

    @Test
    void shouldValidateRequiredFields() {
        assertThrows(IllegalArgumentException.class, () ->
            service.upsertProfile(10L, new CandidateProfileRequest("", "summary", 2, "HCM", List.of("Java"), null, true, null))
        );
    }
}
