package com.project.recruitment.domain;

import java.time.LocalDateTime;

public class Company {
    private Long id;
    private String name;
    private String website;
    private String location;
    private String industry;
    private String description;
    private boolean verified = false;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Company() {
    }

    public Company(Long id, String name, String website, String location, String industry, String description, boolean verified) {
        this.id = id;
        this.name = name;
        this.website = website;
        this.location = location;
        this.industry = industry;
        this.description = description;
        this.verified = verified;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
